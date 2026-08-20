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

      // Succès → rediriger vers la page demandée
      router.push(next);
    } catch {
      setError('Une erreur inattendue s\'est produite.');
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md p-8 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-4"
          style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          Espace réservé
        </span>
        <h1
          className="text-3xl font-medium mb-2"
          style={{ fontFamily: 'var(--f-display)', color: 'var(--paper)' }}
        >
          Administration
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Connectez-vous avec le compte administrateur pour gérer la boutique.
        </p>
      </div>

      {error && (
        <div
          className="mb-4 p-3 rounded-xl text-sm"
          role="alert"
          style={{
            color: '#F6BCAB',
            background: 'rgba(242,163,143,0.1)',
            border: '1px solid rgba(242,163,143,0.3)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--paper)' }}>
            Adresse e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@orixa.fr"
            autoComplete="username"
            required
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--paper)',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--paper)' }}>
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              required
              minLength={8}
              className="w-full px-4 py-3 pr-12 rounded-xl text-sm"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--paper)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium transition-opacity"
          style={{
            background: 'var(--accent)',
            color: 'var(--brand)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          ← Retour à la boutique
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--brand)' }}>
      <Suspense fallback={
        <div className="text-white text-sm">Chargement du formulaire de connexion…</div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

function mapError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'E-mail ou mot de passe incorrect.';
  if (/rate limit|too many/i.test(msg)) return 'Trop de tentatives. Réessayez dans quelques minutes.';
  if (/email not confirmed/i.test(msg)) return 'Confirmez d\'abord votre adresse e-mail.';
  if (/network|failed to fetch/i.test(msg)) return 'Connexion au serveur impossible.';
  return msg;
}
