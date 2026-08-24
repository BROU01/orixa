/**
 * Page admin — Avis clients.
 * Modération des avis, réponses, notes.
 */
const DEMO_AVIS = [
  { client: 'Camille D.', produit: 'Beurre de karité pur', note: 5, text: 'Produit exceptionnel, la peau est très douce. Je recommande !', date: '28 juil. 2026', statut: 'approuve' },
  { client: 'Nicolas L.', produit: 'Savon noir au lait', note: 4, text: 'Bon produit, odeur agréable. Livraison rapide.', date: '27 juil. 2026', statut: 'approuve' },
  { client: 'Awa D.', produit: 'Gari grillé premium', note: 5, text: 'Le meilleur gari que j\'ai goûté en France. Très fidèle au goût togolais.', date: '26 juil. 2026', statut: 'approuve' },
  { client: 'Hugo B.', produit: 'Huile de coco vierge', note: 2, text: 'Produit correct mais emballage abîmé à la réception.', date: '25 juil. 2026', statut: 'en_attente' },
  { client: 'Sofia R.', produit: 'Hibiscus séché bio', note: 5, text: 'Qualité au rendez-vous, coloration intense pour le jus d\'hibiscus.', date: '24 juil. 2026', statut: 'en_attente' },
];

function Stars({ n }: { n: number }) {
  return <span style={{ color: '#D4A017', fontSize: '13px' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

export default function AdminAvisPage() {
  const avg = (DEMO_AVIS.reduce((a, v) => a + v.note, 0) / DEMO_AVIS.length).toFixed(1);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Avis clients</h2>
          <p className="page-sub">Note moyenne : {avg}/5 · {DEMO_AVIS.length} avis</p>
        </div>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <span>Les avis sont des données de démonstration. En production, ils seront gérés via Supabase.</span>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {DEMO_AVIS.map((a, i) => (
            <div key={i} style={{ padding: '16px 18px', borderBottom: i < DEMO_AVIS.length - 1 ? '1px solid var(--a-line)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13.5px' }}>{a.client}</strong>
                <Stars n={a.note} />
                <span className={`pill ${a.statut === 'approuve' ? 'pill--ok' : 'pill--warn'}`}>
                  {a.statut === 'approuve' ? 'Approuvé' : 'En attente'}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--a-muted)' }}>{a.date}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--a-muted)', marginBottom: '4px' }}>Produit : {a.produit}</p>
              <p style={{ fontSize: '13.5px' }}>{a.text}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button className="b b--default b--sm">Répondre</button>
                {a.statut === 'en_attente' && <button className="b b--primary b--sm">Approuver</button>}
                <button className="b b--ghost b--sm" style={{ color: 'var(--a-danger)' }}>Signaler</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
