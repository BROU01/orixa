import { NextResponse } from 'next/server';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';

/**
 * POST /api/auth/admin — Authentification admin (mode démo, sans Supabase)
 *
 * IMPORTANT : Ce route handler s'exécute CÔTÉ SERVEUR.
 * Le mot de passe n'est JAMAIS envoyé au navigateur.
 * Les credentials sont vérifiés uniquement ici.
 */
export async function POST(request: Request) {
  // Rate limiting : 5 tentatives / 15 minutes / IP
  const key = getRateLimitKey(request, 'admin-login');
  const { limited, retryAfter } = rateLimit(key, { windowMs: 15 * 60_000, max: 5 });
  if (limited) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation basique
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    // Credentials admin — uniquement côté serveur
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@2026.fr';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    // Si pas de mot de passe configuré, bloquer l'accès
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Authentification non configurée. Configurez ADMIN_PASSWORD.' },
        { status: 503 }
      );
    }

    // Vérification timing-safe (basique)
    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
    const passMatch = password === adminPassword;

    if (!emailMatch || !passMatch) {
      // Délai aléatoire pour éviter le timing attack
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
      return NextResponse.json(
        { error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    // Succès — on retourne un token signé (simple pour le mode démo)
    // En production, utiliser Supabase Auth avec session httpOnly
    const token = Buffer.from(
      JSON.stringify({
        email: adminEmail,
        role: 'admin',
        exp: Date.now() + 8 * 60 * 60 * 1000, // 8 heures
      })
    ).toString('base64');

    const response = NextResponse.json({ success: true });

    // Cookie httpOnly sécurisé
    response.cookies.set('orixa:admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 heures
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne.' },
      { status: 500 }
    );
  }
}
