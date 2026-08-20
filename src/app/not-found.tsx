import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="auth-body"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <main style={{ textAlign: 'center', padding: '32px', maxWidth: '520px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            border: '1px solid rgba(241,254,200,.3)',
            borderRadius: '2px',
            color: 'rgba(241,254,200,.7)',
          }}
        >
          Erreur 404
        </span>

        <h1
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 500,
            color: 'var(--paper)',
            marginTop: '20px',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}
        >
          Page introuvable
        </h1>

        <p style={{ fontSize: '15px', color: 'rgba(241,254,200,.7)', marginBottom: '32px', lineHeight: 1.6 }}>
          La page que vous recherchez n&apos;existe plus ou a été déplacée.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="gbtn gbtn--solid" style={{ width: 'auto', paddingInline: '24px' }}>
            Retour à l&apos;accueil
          </Link>
          <Link href="/boutique" className="gbtn gbtn--outline" style={{ width: 'auto', paddingInline: '24px' }}>
            Parcourir la boutique
          </Link>
        </div>
      </main>
    </div>
  );
}
