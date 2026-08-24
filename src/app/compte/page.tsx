'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CompteLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Merci de remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email, password }),
        });

        const resData = await res.json();
        if (!res.ok) {
          setError(resData.error || 'Identifiants incorrects.');
          setLoading(false);
          return;
        }
      }

      // Pas de texte "Redirection" — l'état du bouton suffit
      router.push(redirectUrl);
    } catch {
      setError('Une erreur inattendue s\'est produite.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/compte`,
        },
      });
    } catch {
      setError('La connexion Google n\'est pas encore configurée.');
    }
  };

  return (
    <div className="glass">
      <span className="glass__eyebrow">Épicerie &amp; cosmétiques</span>
      <h1 className="glass__title">Connexion</h1>
      <p className="glass__sub">Retrouvez vos commandes, vos favoris et vos adresses de livraison.</p>

      {error && (
        <div className="auth-note" role="alert" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="gform" noValidate>
        <div className="gfield">
          <label className="gfield__label" htmlFor="email">Adresse e-mail</label>
          <input
            className="gfield__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="gfield">
          <div className="gfield__row">
            <label className="gfield__label" htmlFor="password">Mot de passe</label>
            <a className="gfield__link" href="/compte/mot-de-passe-oublie">Mot de passe oublié&nbsp;?</a>
          </div>
          <div className="gfield__wrap">
            <input
              className="gfield__input"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 6 caractères"
            />
            <button
              type="button"
              className="gfield__toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 3.87-4.87" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a17.63 17.63 0 0 1-3.17 4.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <label className="gcheck">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span className="gcheck__box" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span>Rester connecté sur cet appareil</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="gbtn gbtn--solid"
          aria-busy={loading}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <div className="gdivider">ou continuer avec</div>

        <div className="gsocials">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="gbtn gbtn--outline"
            aria-label="Continuer avec Google"
          >
            <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Google
          </button>
        </div>

        <p className="gfoot">Nouveau sur MAISON LA GRACE&nbsp;? <a href="/compte/inscription">Créer un compte</a></p>
      </form>
    </div>
  );
}

export default function ComptePage() {
  return (
    <div className="auth-body">
      <header className="auth-top">
        <a href="/" className="brand" aria-label="MAISON LA GRACE, accueil">
          <span className="brand__mark">MLG</span>
        </a>
        <a href="/" className="auth-top__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Retour à la boutique</span>
        </a>
      </header>

      <main className="auth-center">
        <Suspense fallback={
          <div style={{ color: 'rgba(241,254,200,.6)', fontSize: '13px' }}>Chargement du formulaire…</div>
        }>
          <CompteLoginForm />
        </Suspense>
      </main>

      <footer className="auth-foot">
        <p>&copy; {new Date().getFullYear()} MAISON LA GRACE</p>
        <nav aria-label="Liens légaux">
          <a href="/contact">Aide</a>
          <a href="/confidentialite">Confidentialité</a>
          <a href="/cgv">Conditions</a>
        </nav>
      </footer>
    </div>
  );
}
