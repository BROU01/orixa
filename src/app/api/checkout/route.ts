import { NextResponse } from 'next/server';
import { getDiscounts, getProducts } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, promoCode } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Le panier est vide.' }, { status: 400 });
    }

    const allProducts = await getProducts();
    let totalEUR = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = allProducts.find((p) => p.id === item.id);
      if (!dbProduct) continue;

      const qty = Math.max(1, parseInt(item.qty || item.qte || 1, 10));
      const lineTotal = dbProduct.prix * qty;
      totalEUR += lineTotal;

      validatedItems.push({
        id: dbProduct.id,
        nom: dbProduct.nom,
        prix: dbProduct.prix,
        qty,
        lineTotal,
      });
    }

    let discountAmount = 0;
    let discountInfo = null;

    if (promoCode && typeof promoCode === 'string') {
      const discounts = await getDiscounts();
      const codeClean = promoCode.trim().toUpperCase();
      const foundPromo = discounts.find((d) => d.code === codeClean && d.actif);

      if (foundPromo) {
        if (foundPromo.min && totalEUR < foundPromo.min) {
          discountInfo = { error: `Le code ${codeClean} nécessite un montant minimum de ${foundPromo.min} €.` };
        } else {
          if (foundPromo.type === 'pct') {
            discountAmount = (totalEUR * foundPromo.valeur) / 100;
          } else if (foundPromo.type === 'fixe') {
            discountAmount = foundPromo.valeur;
          }
          discountInfo = { code: codeClean, amount: discountAmount, type: foundPromo.type };
        }
      } else {
        discountInfo = { error: 'Code promo invalide ou expiré.' };
      }
    }

    const shippingEUR = totalEUR >= 80 ? 0 : 4.90;
    const finalTotalEUR = Math.max(0, totalEUR - discountAmount) + shippingEUR;

    return NextResponse.json({
      success: true,
      items: validatedItems,
      subtotalEUR: totalEUR,
      discountAmount,
      discountInfo,
      shippingEUR,
      finalTotalEUR,
    });
  } catch {
    return NextResponse.json({ error: 'Erreur lors du calcul de la commande.' }, { status: 500 });
  }
}
