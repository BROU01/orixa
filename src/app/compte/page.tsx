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
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Direct Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Mode secours API
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email, password }),
        });

        const resData = await res.json();
        if (!res.ok) {
          setError(resData.error || 'Connexion impossible. Vérifiez vos identifiants.');
          setLoading(false);
          return;
        }
      }

      setSuccessMsg('Connexion réussie ! Redirection en cours…');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
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
      <span className="glass__eyebrow">Épicerie & Cosmétiques ORIXA</span>
      <h1 className="glass__title">Connexion</h1>
      <p className="glass__sub">Retrouvez vos commandes, vos favoris et vos adresses de livraison.</p>

      {error && (
        <div
          className="mb-4 p-3 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(163,59,42,0.2)', color: '#FF9B8A', border: '1px solid rgba(163,59,42,0.4)' }}
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div
          className="mb-4 p-3 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(47,107,79,0.2)', color: '#6FD08B', border: '1px solid rgba(47,107,79,0.4)' }}
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label className="field__label" htmlFor="email">Adresse e-mail</label>
          <input
            className="field__input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
          />
        </div>

        <div className="field">
          <div className="field__labelrow">
            <label className="field__label" htmlFor="password">Mot de passe</label>
            <a className="field__link" href="/compte/mot-de-passe-oublie">Mot de passe oublié ?</a>
          </div>
          <div className="field__wrap" style={{ position: 'relative' }}>
            <input
              className="field__input"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 6 caractères"
              required
              minLength={6}
            />
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Afficher le mot de passe"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <label className="gcheck" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Rester connecté sur cet appareil</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="gbtn gbtn--solid"
          style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'var(--brand)', color: 'var(--ink)', fontWeight: 700, borderRadius: '4px' }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <div className="gdivider" style={{ textAlign: 'center', marginBlock: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          ou continuer avec
        </div>

        <div className="gsocials" style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="gbtn gbtn--glass"
            style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Google
          </button>
        </div>

        <p className="gfoot" style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
          Nouveau sur ORIXA ? <a href="/compte/inscription" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>Créer un compte</a>
        </p>
      </form>
    </div>
  );
}

export default function ComptePage() {
  return (
    <div className="auth-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="auth-top">
        <a href="/" className="brand" aria-label="ORIXA, accueil">
          <span className="brand__mark" style={{ fontSize: '24px', fontFamily: 'var(--f-display)', color: '#FBFAF6' }}>ORIXA</span>
        </a>
        <a href="/" className="auth-top__back">
          <span>← Retour à la boutique</span>
        </a>
      </header>

      <main className="auth-center" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <Suspense fallback={<div className="text-white text-sm">Chargement…</div>}>
          <CompteLoginForm />
        </Suspense>
      </main>

      <footer className="auth-bottom" style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
        <p>© {new Date().getFullYear()} ORIXA — Tous droits réservés</p>
      </footer>
    </div>
  );
}
