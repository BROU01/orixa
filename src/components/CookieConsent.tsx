'use client';

import { useState, useEffect } from 'react';

/**
 * Bannière de consentement cookies RGPD.
 * Apparaît une seule fois, puis mémorise le choix dans localStorage.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem('orixa:cookie-consent');
      if (!choice) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem('orixa:cookie-consent', 'accepted'); } catch {}
    setVisible(false);
  };

  const refuse = () => {
    try { localStorage.setItem('orixa:cookie-consent', 'refused'); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--ink)',
        color: 'var(--paper)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap',
        fontSize: '13.5px',
        lineHeight: '1.6',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <p style={{ flex: '1 1 400px', margin: 0, opacity: 0.9 }}>
        Nous utilisons des cookies strictement nécessaires au fonctionnement du site
        (session panier, devise, favoris). Aucun cookie de traçage n&apos;est utilisé.
        Consultez notre{' '}
        <a href="/cookies" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
          politique de cookies
        </a>.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={refuse}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'var(--paper)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Refuser
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--accent)',
            color: 'var(--ink)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
