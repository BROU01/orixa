import { NextResponse } from 'next/server';
import { getProducts, getDiscounts } from '@/lib/data';
import { createOrder } from '@/lib/orders';
import { logActivity } from '@/lib/activity';
import { sendEmail } from '@/lib/email';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

const BUSINESS_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'maroquinerie.lagrace@gmail.com';

const MAX_TEXT_FIELD = 200;

function cleanText(value: unknown, max = MAX_TEXT_FIELD): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * POST /api/orders — Enregistre une commande côté serveur (Supabase).
 *
 * Revalide entièrement les articles et le code promo à partir du catalogue
 * serveur : les prix et la remise envoyés par le client ne sont jamais pris
 * pour argent comptant, exactement comme /api/checkout.
 */
export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415 });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
  }

  const key = getRateLimitKey(request, 'create-order');
  const { limited, retryAfter } = rateLimit(key, { windowMs: 60_000, max: 10 });
  if (limited) {
    return NextResponse.json(
      { error: 'Trop de commandes envoyées. Réessayez dans un instant.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { items, promoCode, customer, delivery } = body;

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'Panier invalide.' }, { status: 400 });
    }
    if (!customer || typeof customer !== 'object') {
      return NextResponse.json({ error: 'Coordonnées client manquantes.' }, { status: 400 });
    }

    const customerName = `${cleanText(customer.firstName)} ${cleanText(customer.lastName)}`.trim();
    const customerEmail = cleanText(customer.email, 254);
    const address = cleanText(customer.address, 300);
    const city = cleanText(customer.city);
    const postalCode = cleanText(customer.postalCode, 20);
    const country = cleanText(customer.country) || 'France';
    const customerPhone = cleanText(customer.phone, 40);

    if (!customerName || !customerEmail.includes('@') || !address || !city || !postalCode) {
      return NextResponse.json({ error: 'Coordonnées client incomplètes.' }, { status: 400 });
    }

    const deliveryMethod = cleanText(delivery?.method) || 'mondial_relay';
    const paymentMethod = cleanText(delivery?.paymentMethod) || 'card';

    const allProducts = await getProducts();
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item?.id || typeof item.id !== 'string') continue;
      const product = allProducts.find((p) => p.id === item.id);
      if (!product) continue;

      const rawQty = parseInt(item.qty ?? item.qte ?? '1', 10);
      const qty = Math.min(99, Math.max(1, Number.isNaN(rawQty) ? 1 : rawQty));
      subtotal += product.prix * qty;
      validatedItems.push({ id: product.id, nom: product.nom, prix: product.prix, qty });
    }

    if (validatedItems.length === 0) {
      return NextResponse.json({ error: 'Aucun article valide dans le panier.' }, { status: 400 });
    }

    let discount = 0;
    let appliedPromoCode: string | undefined;
    if (promoCode && typeof promoCode === 'string') {
      const discounts = await getDiscounts();
      const codeClean = promoCode.trim().toUpperCase();
      const found = discounts.find((d) => d.code === codeClean && d.actif);
      if (found && (!found.min || subtotal >= found.min)) {
        discount = found.type === 'pct' ? (subtotal * found.valeur) / 100 : found.valeur;
        appliedPromoCode = codeClean;
      }
    }

    const shipping = subtotal >= 80 ? 0 : 4.90;
    const total = Math.max(0, subtotal - discount) + shipping;

    const { id, persisted } = await createOrder({
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      address,
      city,
      postalCode,
      country,
      deliveryMethod,
      paymentMethod,
      items: validatedItems,
      subtotal,
      shipping,
      discount,
      total,
      promoCode: appliedPromoCode,
    });

    if (persisted) {
      await logActivity('Système', 'Nouvelle commande reçue', `#${id}`, 'system');
    }

    const itemsHtml = validatedItems
      .map((i) => `<li>${i.qty} × ${i.nom} — ${(i.prix * i.qty).toFixed(2)} €</li>`)
      .join('');

    // E-mails best-effort : une commande valide n'est jamais bloquée par un envoi qui échoue.
    await sendEmail({
      to: customerEmail,
      subject: `Confirmation de votre commande #${id} — MAISON LA GRACE`,
      html: `
        <p>Bonjour ${customerName},</p>
        <p>Merci pour votre commande <strong>#${id}</strong> ! Voici son récapitulatif :</p>
        <ul>${itemsHtml}</ul>
        <p>Sous-total : ${subtotal.toFixed(2)} €<br />
        Livraison : ${shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} €`}<br />
        ${discount > 0 ? `Remise : -${discount.toFixed(2)} €<br />` : ''}
        <strong>Total : ${total.toFixed(2)} €</strong></p>
        <p>Livraison à : ${address}, ${postalCode} ${city}, ${country}</p>
        <p>Nous préparons votre commande avec soin.<br />— L'équipe MAISON LA GRACE</p>
      `,
    });
    await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Nouvelle commande #${id} — ${total.toFixed(2)} €`,
      html: `<p>${customerName} (${customerEmail}) vient de passer la commande #${id} pour un total de ${total.toFixed(2)} €.</p><ul>${itemsHtml}</ul>`,
    });

    return NextResponse.json({
      success: true,
      id,
      persisted,
      subtotal,
      shipping,
      discount,
      total,
    });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement de la commande.' }, { status: 500 });
  }
}
