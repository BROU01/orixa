'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/compte`,
      });

      if (authError) {
        // Fallback API Route
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reset', email }),
        });
        const resData = await res.json();
        if (!res.ok) {
          setError(resData.error || 'Impossible d\'envoyer l\'e-mail de réinitialisation.');
          setLoading(false);
          return;
        }
      }

      setSuccessMsg('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
      setLoading(false);
    } catch {
      setError('Une erreur inattendue s\'est produite.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="auth-top">
        <a href="/" className="brand" aria-label="MAISON LA GRACE, accueil">
          <span className="brand__mark" style={{ fontSize: '24px', fontFamily: 'var(--f-display)', color: '#FBFAF6' }}>MAISON LA GRACE</span>
        </a>
        <a href="/compte" className="auth-top__back">
          <span>← Se connecter</span>
        </a>
      </header>

      <main className="auth-center" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass">
          <span className="glass__eyebrow">Récupération de compte</span>
          <h1 className="glass__title">Mot de passe oublié</h1>
          <p className="glass__sub">Saisissez votre e-mail pour recevoir les instructions de réinitialisation.</p>

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

            <button
              type="submit"
              disabled={loading}
              className="gbtn gbtn--solid"
              style={{ width: '100%', marginTop: '20px', padding: '14px', background: 'var(--brand)', color: 'var(--ink)', fontWeight: 700, borderRadius: '4px' }}
            >
              {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
            </button>
          </form>
        </div>
      </main>

      <footer className="auth-bottom" style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
        <p>© {new Date().getFullYear()} MAISON LA GRACE — Tous droits réservés</p>
      </footer>
    </div>
  );
}
