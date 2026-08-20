import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
      style={{ background: '#111110', color: '#FBFAF6', fontFamily: 'var(--f-body)' }}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: '#C9A84C' }}
        />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* 404 Number Badge */}
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
          style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
        >
          Erreur 404 · Page introuvable
        </span>

        <h1
          className="text-4xl sm:text-6xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--f-display)', color: 'var(--paper)' }}
        >
          Oups ! Cette page s&apos;est égarée dans les sables
        </h1>

        <p className="text-base sm:text-lg text-[var(--paper)]/75 max-w-lg mx-auto leading-relaxed">
          La page que vous recherchez n&apos;existe plus ou a été déplacée. Retournez à l&apos;accueil de la maison ORIXA pour continuer votre navigation.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="btn btn--primary btn--lg w-full sm:w-auto"
            style={{ background: 'var(--brand)', color: 'var(--ink)' }}
          >
            ← Retourner à l&apos;accueil ORIXA
          </Link>
          <Link
            href="/boutique"
            className="btn btn--secondary btn--lg w-full sm:w-auto !text-white !border-white/30 hover:!border-white"
          >
            Parcourir la boutique
          </Link>
        </div>
      </main>
    </div>
  );
}
