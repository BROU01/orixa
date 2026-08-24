'use client';

/**
 * Page admin — Rapports & exports.
 * Rapports de ventes, commandes, clients, stock avec export CSV.
 */
const RAPPORTS = [
  { nom: 'Ventes par période', desc: 'Chiffre d\'affaires, commandes et panier moyen par jour/semaine/mois.', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg> },
  { nom: 'Performance produits', desc: 'Top ventes, produits les moins vendus, marge par références.', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg> },
  { nom: 'Clients & fidélisation', desc: 'Nouveaux clients, récurrents, taux de réachat, répartition géo.', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg> },
  { nom: 'Stock & inventaire', desc: 'Valeur du stock, ruptures, mouvements, rotation.', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg> },
  { nom: 'Promotions', desc: 'Performance des codes, remises accordées, panier moyen avec code.', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M20.6 13.4L12 22l-9-9V3h10z" /><circle cx="7.5" cy="7.5" r="1.2" /></svg> },
  { nom: 'Livraison', desc: 'Délais, taux de réussite, retours par transporteur.', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> },
];

export default function AdminRapportsPage() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Rapports</h2>
          <p className="page-sub">Générez et exportez des rapports détaillés.</p>
        </div>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Les exports sont en mode démo. En production, les rapports seront générés côté serveur.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {RAPPORTS.map((r, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card__body" style={{ flex: 1 }}>
              <div style={{ color: 'var(--a-brand)', marginBottom: '10px' }}>{r.svg}</div>
              <h3 style={{ fontSize: '14.5px', fontWeight: 600, marginBottom: '6px' }}>{r.nom}</h3>
              <p style={{ fontSize: '13px', color: 'var(--a-muted)', lineHeight: '1.5' }}>{r.desc}</p>
            </div>
            <div className="card__foot" style={{ display: 'flex', gap: '8px' }}>
              <button className="b b--default b--sm" style={{ flex: 1 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                CSV
              </button>
              <button className="b b--default b--sm" style={{ flex: 1 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
