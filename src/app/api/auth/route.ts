import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415, headers: { 'Cache-Control': 'no-store' } });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
  }

  // Rate limiting : 10 requêtes / minute / IP
  const key = getRateLimitKey(request, 'auth');
  const { limited, retryAfter } = rateLimit(key, { windowMs: 60_000, max: 10 });
  if (limited) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || typeof email !== 'string' || email.length > 254) {
      return NextResponse.json({ error: 'Adresse e-mail valide requise.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const accountLimit = rateLimit(`auth-account:${normalizedEmail}`, { windowMs: 15 * 60_000, max: 10 });
    if (accountLimit.limited) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429, headers: { 'Retry-After': String(accountLimit.retryAfter), 'Cache-Control': 'no-store' } }
      );
    }

    if (action === 'signup') {
      if (typeof password !== 'string' || password.length < 8 || password.length > 256) {
        return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: typeof name === 'string' ? name.slice(0, 100) : '' },
        },
      });

      if (error) {
        // Ne pas révéler les détails de l'erreur Supabase
        return NextResponse.json({ error: 'Inscription impossible. Réessayez plus tard.' }, { status: 400 });
      }

      // Ne pas retourner la session côté client
      return NextResponse.json({ success: true });
    }

    if (action === 'login') {
      if (typeof password !== 'string' || password.length === 0 || password.length > 256) {
        return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
      }

      // Ne pas retourner la session côté client
      return NextResponse.json({ success: true });
    }

    if (action === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte`,
      });

      if (error) {
        // Message générique pour ne pas révéler si l'email existe
        return NextResponse.json({ success: true, message: 'Si cet e-mail existe, un lien vous a été envoyé.' });
      }

      return NextResponse.json({ success: true, message: 'Si cet e-mail existe, un lien vous a été envoyé.' });
    }

    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
