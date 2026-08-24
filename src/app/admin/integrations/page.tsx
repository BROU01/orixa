'use client';

/**
 * Page admin — Intégrations.
 * Connexion avec services tiers : paiement, livraison, analytique.
 */
const INTEGRATIONS = [
  { nom: 'Stripe', desc: 'Paiement par carte bancaire (Visa, Mastercard).', cat: 'Paiement', status: 'configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
  { nom: 'PayPal', desc: 'Paiement via PayPal et cartes associées.', cat: 'Paiement', status: 'configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
  { nom: 'Mondial Relay', desc: 'Livraison en point relais partout en France.', cat: 'Livraison', status: 'non_configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> },
  { nom: 'Colissimo', desc: 'Livraison à domicile avec suivi.', cat: 'Livraison', status: 'non_configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg> },
  { nom: 'Google Analytics', desc: 'Suivi du trafic et des conversions.', cat: 'Analytique', status: 'configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg> },
  { nom: 'Google Search Console', desc: 'Suivi du référencement naturel.', cat: 'Analytique', status: 'configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
  { nom: 'Supabase', desc: 'Base de données et authentification.', cat: 'Base de données', status: 'configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg> },
  { nom: 'Resend', desc: 'Envoi d\'e-mails transactionnels.', cat: 'E-mail', status: 'non_configuree', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
];

const CATS = ['Paiement', 'Livraison', 'Analytique', 'Base de données', 'E-mail'];

export default function AdminIntegrationsPage() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Intégrations</h2>
          <p className="page-sub">Connectez des services tiers à votre boutique.</p>
        </div>
      </div>

      {CATS.map(cat => {
        const items = INTEGRATIONS.filter(i => i.cat === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--a-muted)', marginBottom: '10px' }}>
              {cat}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
              {items.map((item, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px' }}>
                  <span style={{ color: 'var(--a-brand)', flex: 'none' }}>{item.svg}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nom}</div>
                    <div style={{ fontSize: '12px', color: 'var(--a-muted)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <span className={`pill ${item.status === 'configuree' ? 'pill--ok' : 'pill--neutral'}`}>
                    {item.status === 'configuree' ? 'Configurée' : 'À configurer'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
