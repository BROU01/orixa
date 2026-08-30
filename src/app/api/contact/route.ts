import { NextResponse } from 'next/server';
import { saveContactMessage } from '@/lib/contact';
import { sendEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

const BUSINESS_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'maroquinerie.lagrace@gmail.com';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** POST /api/contact — Enregistre un message de contact et notifie l'équipe par e-mail. */
export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415 });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
  }

  const key = getRateLimitKey(request, 'contact-form');
  const { limited, retryAfter } = rateLimit(key, { windowMs: 60_000, max: 5 });
  if (limited) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés. Réessayez dans un instant.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 120) : 'Autre';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';

    if (!name || !email.includes('@') || !message) {
      return NextResponse.json({ error: 'Merci de renseigner votre nom, un e-mail valide et un message.' }, { status: 400 });
    }

    await saveContactMessage({ name, email, subject, message });
    await logActivity(name, 'Nouveau message de contact', subject, 'create');

    // Notification à l'équipe — best-effort, ne bloque jamais la réponse au client.
    await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `[Contact] ${subject} — ${name}`,
      html: `
        <p><strong>De :</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    });

    // Accusé de réception au client.
    await sendEmail({
      to: email,
      subject: 'Nous avons bien reçu votre message — MAISON LA GRACE',
      html: `
        <p>Bonjour ${escapeHtml(name)},</p>
        <p>Merci de nous avoir contactés. Notre équipe vous répondra sous 24 à 48h ouvrées.</p>
        <p>— L'équipe MAISON LA GRACE</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l’envoi du message.' }, { status: 500 });
  }
}
