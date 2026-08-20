'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(mapError(authError.message));
        setLoading(false);
        return;
      }

      // Vérifier que c'est bien l'admin
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@2026.fr';
      if (data.user?.email?.toLowerCase() !== adminEmail.toLowerCase()) {
        await supabase.auth.signOut();
        setError('Ce compte n\'a pas accès à l\'administration.');
        setLoading(false);
        return;
      }

      // Succès → rediriger vers /admin (ou l'URL demandée)
      router.push(next);
    } catch {
      setError('Une erreur inattendue s\'est produite.');
      setLoading(false);
    }
  };

  return (
    <div className="glass">
      <span className="glass__eyebrow">Espace réservé</span>
      <h1 className="glass__title">Administration</h1>
      <p className="glass__sub">Connectez-vous avec le compte administrateur pour gérer la boutique.</p>

      {error && (
        <div className="auth-note" role="alert" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="gform" noValidate>
        <div className="gfield">
          <label className="gfield__label" htmlFor="admin-email">Adresse e-mail</label>
          <input
            className="gfield__input"
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@orixa.fr"
          />
        </div>

        <div className="gfield">
          <label className="gfield__label" htmlFor="admin-password">Mot de passe</label>
          <div className="gfield__wrap">
            <input
              className="gfield__input"
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
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

        <button
          type="submit"
          disabled={loading}
          className="gbtn gbtn--solid"
          aria-busy={loading}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <a href="/" className="gfield__link">
          &larr; Retour à la boutique
        </a>
      </div>
    </div>
  );
}

/**
 * Page de connexion admin enveloppée dans un Suspense boundary
 * pour respecter la contrainte Next.js App Router sur useSearchParams.
 */
export default function AdminLoginPage() {
  return (
    <div className="auth-body">
      <header className="auth-top">
        <a href="/" className="brand" aria-label="ORIXA, accueil">
          <span className="brand__mark">ORIXA</span>
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
          <AdminLoginForm />
        </Suspense>
      </main>

      <footer className="auth-foot">
        <p>&copy; {new Date().getFullYear()} ORIXA</p>
        <nav aria-label="Liens légaux">
          <a href="/contact">Aide</a>
          <a href="/confidentialite">Confidentialité</a>
          <a href="/cgv">Conditions</a>
        </nav>
      </footer>
    </div>
  );
}

function mapError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'Identifiants incorrects.';
  if (/rate limit|too many/i.test(msg)) return 'Trop de tentatives. Réessayez dans quelques minutes.';
  if (/email not confirmed/i.test(msg)) return 'Confirmez d\'abord votre adresse e-mail.';
  if (/network|failed to fetch/i.test(msg)) return 'Connexion au serveur impossible.';
  return 'Identifiants incorrects.';
}
