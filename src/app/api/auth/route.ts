import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Adresse e-mail valide requise.' }, { status: 400 });
    }

    if (action === 'signup') {
      if (!password || password.length < 8) {
        return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name || '' },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, user: data.user, session: data.session });
    }

    if (action === 'login') {
      if (!password) {
        return NextResponse.json({ error: 'Mot de passe requis.' }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
      }

      return NextResponse.json({ success: true, user: data.user, session: data.session });
    }

    if (action === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte`,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Un e-mail de réinitialisation vous a été envoyé.' });
    }

    return NextResponse.json({ error: 'Action non supportée.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
