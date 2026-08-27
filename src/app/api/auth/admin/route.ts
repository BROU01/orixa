import { NextResponse } from 'next/server';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { constantTimeEqual, createAdminSessionToken } from '@/lib/admin-session';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

/**
 * POST /api/auth/admin — Authentification admin (mode démo, sans Supabase)
 *
 * IMPORTANT : Ce route handler s'exécute CÔTÉ SERVEUR.
 * Le mot de passe n'est JAMAIS envoyé au navigateur.
 * Les credentials sont vérifiés uniquement ici.
 */
export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415, headers: { 'Cache-Control': 'no-store' } });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
  }

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

    if (email.length > 254 || password.length > 256) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const accountLimit = rateLimit(`admin-login-account:${normalizedEmail}`, { windowMs: 15 * 60_000, max: 5 });
    if (accountLimit.limited) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
        { status: 429, headers: { 'Retry-After': String(accountLimit.retryAfter), 'Cache-Control': 'no-store' } }
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

    // Comparaison du secret sans sortie anticipée sur le contenu.
    const emailMatch = normalizedEmail === adminEmail.trim().toLowerCase();
    const passMatch = constantTimeEqual(password, adminPassword);

    if (!emailMatch || !passMatch) {
      // Délai aléatoire pour éviter le timing attack
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
      return NextResponse.json(
        { error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    // Succès — session HMAC vérifiable côté middleware.
    // Sans secret serveur, le mode démo reste désactivé.
    const token = await createAdminSessionToken(adminEmail);
    const response = NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'no-store' },
    });

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
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
