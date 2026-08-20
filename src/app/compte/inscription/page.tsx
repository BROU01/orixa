'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || !password || password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (authError) {
        // Fallback API Route
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signup', email, password, name }),
        });
        const resData = await res.json();
        if (!res.ok) {
          setError(resData.error || 'Erreur lors de la création du compte.');
          setLoading(false);
          return;
        }
      }

      setSuccessMsg('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        router.push('/compte');
      }, 1500);
    } catch {
      setError('Une erreur inattendue s\'est produite.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="auth-top">
        <a href="/" className="brand" aria-label="ORIXA, accueil">
          <span className="brand__mark" style={{ fontSize: '24px', fontFamily: 'var(--f-display)', color: '#FBFAF6' }}>ORIXA</span>
        </a>
        <a href="/compte" className="auth-top__back">
          <span>← Se connecter</span>
        </a>
      </header>

      <main className="auth-center" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass">
          <span className="glass__eyebrow">Maison ORIXA</span>
          <h1 className="glass__title">Créer un compte</h1>
          <p className="glass__sub">Rejoignez la communauté ORIXA et cumulez vos points de fidélité.</p>

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
              <label className="field__label" htmlFor="name">Nom complet</label>
              <input
                className="field__input"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom et Nom"
                required
              />
            </div>

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
              <label className="field__label" htmlFor="password">Mot de passe</label>
              <div className="field__wrap" style={{ position: 'relative' }}>
                <input
                  className="field__input"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 8 caractères"
                  required
                  minLength={8}
                />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(241,254,200,0.6)' }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 3.87-4.87"/>
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a17.63 17.63 0 0 1-3.17 4.19"/>
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gbtn gbtn--solid"
              style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'var(--brand)', color: 'var(--ink)', fontWeight: 700, borderRadius: '4px' }}
            >
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>

            <p className="gfoot" style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              Déjà un compte ? <a href="/compte" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>Se connecter</a>
            </p>
          </form>
        </div>
      </main>

      <footer className="auth-bottom" style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
        <p>© {new Date().getFullYear()} ORIXA — Tous droits réservés</p>
      </footer>
    </div>
  );
}
