/**
 * Page admin — Fournisseurs.
 * Gestion des fournisseurs, coûts d'achat, contacts.
 */
const DEMO_FOURN = [
  { nom: 'Coopérative Togba', specialite: 'Karité, beurre de karité', contact: 'Koffi A.', email: 'koffi@togba.tg', produits: 12, delai: '5-7 jours' },
  { nom: 'Ferme du Grand Nord', specialite: 'Gari, igname, maïs', contact: 'Aminata B.', email: 'aminata@fgn.tg', produits: 8, delai: '3-5 jours' },
  { nom: 'Jardins de l\'Ogooué', specialite: 'Cosmétiques naturels', contact: 'Pierre M.', email: 'pierre@jardinsoga.com', produits: 15, delai: '7-10 jours' },
  { nom: 'Import-Export Sénégal', specialite: 'Hibiscus, noix de cola, épices', contact: 'Moussa D.', email: 'moussa@ies.sn', produits: 10, delai: '10-14 jours' },
];

export default function AdminFournisseursPage() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Fournisseurs</h2>
          <p className="page-sub">{DEMO_FOURN.length} fournisseurs enregistrés.</p>
        </div>
        <button className="b b--primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Ajouter un fournisseur
        </button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Fournisseur</th>
                <th>Spécialité</th>
                <th>Contact</th>
                <th className="tbl__num">Produits</th>
                <th>Délai moyen</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_FOURN.map((f, i) => (
                <tr key={i}>
                  <td><strong>{f.nom}</strong></td>
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{f.specialite}</td>
                  <td>
                    <span style={{ fontSize: '13px' }}>{f.contact}</span>
                    <br />
                    <span style={{ fontSize: '11.5px', color: 'var(--a-muted)' }}>{f.email}</span>
                  </td>
                  <td className="tbl__num">{f.produits}</td>
                  <td style={{ fontSize: '12px' }}>{f.delai}</td>
                  <td className="tbl__num">
                    <button className="b b--default b--sm">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
