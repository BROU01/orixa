/**
 * Page admin — Journal d'activité.
 * Historique des actions du back-office.
 */
const DEMO_LOG = [
  { user: 'Ama K.', action: 'Connexion', target: '', time: 'il y a 5 min', type: 'auth' },
  { user: 'Ama K.', action: 'Modifié le produit', target: 'Beurre de karité pur', time: 'il y a 20 min', type: 'edit' },
  { user: 'Ama K.', action: 'Ajouté un produit', target: 'Savon noir au lait', time: 'il y a 1h', type: 'create' },
  { user: 'Système', action: 'Nouvelle commande reçue', target: '#ORX-2418', time: 'il y a 2h', type: 'system' },
  { user: 'Ama K.', action: 'Modifié le thème', target: 'Couleur d\'accent', time: 'hier', type: 'edit' },
  { user: 'Ama K.', action: 'Exporté un rapport', target: 'Ventes — juillet 2026', time: 'hier', type: 'export' },
  { user: 'Système', action: 'Rupture de stock', target: 'Igname fléchée', time: 'il y a 2 jours', type: 'system' },
  { user: 'Ama K.', action: 'Supprimé un code promo', target: 'TEST10', time: 'il y a 3 jours', type: 'delete' },
];

const TYPE_COLOR: Record<string, string> = {
  auth: 'var(--a-ok)',
  edit: 'var(--a-brand)',
  create: 'var(--a-ok)',
  system: 'var(--a-warn)',
  export: 'var(--a-ink-2)',
  delete: 'var(--a-danger)',
};

export default function AdminJournalPage() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Journal d&apos;activité</h2>
          <p className="page-sub">Historique des actions effectuées dans le back-office.</p>
        </div>
        <button className="b b--default">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Exporter
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {DEMO_LOG.map((l, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderBottom: i < DEMO_LOG.length - 1 ? '1px solid var(--a-line)' : 'none',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '999px',
                background: TYPE_COLOR[l.type] || 'var(--a-muted)',
                flex: 'none',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{l.user}</span>
                <span style={{ fontSize: '13px' }}> {l.action}</span>
                {l.target && <span style={{ fontSize: '13px', color: 'var(--a-brand)' }}> {l.target}</span>}
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--a-muted)', whiteSpace: 'nowrap' }}>{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
