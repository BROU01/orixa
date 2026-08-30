const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.EMAIL_FROM || 'MAISON LA GRACE <onboarding@resend.dev>';

export const isEmailConfigured = Boolean(RESEND_API_KEY);

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envoie un e-mail via l'API Resend (https://resend.com). Best-effort et
 * tolérant : si RESEND_API_KEY n'est pas configurée, ne fait rien et retourne
 * `false` sans jamais lever — l'appelant décide s'il doit prévenir l'admin.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  if (!isEmailConfigured) return false;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
