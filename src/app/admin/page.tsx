import { getProducts, getCategories } from '@/lib/data';

/**
 * Tableau de bord admin — Vue d'ensemble.
 * Fidèle au projet orixa-site-complet original.
 */
export default async function AdminDashboard() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 35).length;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Tableau de bord</h2>
          <p className="page-sub">Vue d&apos;ensemble des 30 derniers jours.</p>
        </div>
        <a className="b b--primary" href="/admin/produits">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter un produit
        </a>
      </div>

      {/* Note */}
      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          Le chiffre d&apos;affaires, les commandes et les clients sont des données de démonstration.
          Le catalogue, les contenus et le thème sont réels et modifiables.
        </span>
      </div>

      {/* KPIs */}
      <div className="kpis">
        <div className="kpi">
          <p className="kpi__label">Références au catalogue</p>
          <p className="kpi__value">{totalProducts}</p>
          <p className="kpi__delta" style={{ color: 'var(--a-muted)' }}>
            <span className="kpi__note">
              {outOfStock === 0 ? 'Aucune rupture' : `${outOfStock} en rupture`}
            </span>
          </p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Stock faible</p>
          <p className="kpi__value">{lowStock}</p>
          <p className="kpi__delta kpi__delta--down">
            <span className="kpi__note">produits sous 35 unités</span>
          </p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Catégories</p>
          <p className="kpi__value">{categories.length}</p>
          <p className="kpi__delta" style={{ color: 'var(--a-muted)' }}>
            <span className="kpi__note">rayons actifs</span>
          </p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Ruptures</p>
          <p className="kpi__value">{outOfStock}</p>
          <p className="kpi__delta" style={{ color: outOfStock > 0 ? 'var(--a-danger)' : 'var(--a-ok)' }}>
            <span className="kpi__note">
              {outOfStock > 0 ? 'à réapprovisionner' : 'tout est en stock'}
            </span>
          </p>
        </div>
      </div>

      {/* Grid 2 colonnes */}
      <div className="grid-2">
        {/* Répartition par rayon */}
        <section className="card">
          <div className="card__head">
            <h3 className="card__title">Répartition par rayon</h3>
          </div>
          <div className="card__body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((cat) => {
                const count = products.filter((p) => p.cat === cat.id).length;
                const pct = totalProducts ? Math.round((count / totalProducts) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '4px' }}>
                      <span>{cat.label}</span>
                      <span style={{ color: 'var(--a-muted)' }}>{count} · {pct}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: 'var(--a-line)' }}>
                      <div
                        style={{
                          height: '100%',
                          borderRadius: '999px',
                          width: `${pct}%`,
                          background: cat.color || 'var(--a-brand)',
                          transition: 'width .3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stock faible */}
        <section className="card">
          <div className="card__head">
            <h3 className="card__title">Stock faible</h3>
            <a className="b b--default b--sm" href="/admin/produits">Gérer</a>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <tbody>
                {products
                  .filter((p) => p.stock <= 35)
                  .sort((a, b) => a.stock - b.stock)
                  .slice(0, 6)
                  .map((p) => {
                    const cls = p.stock <= 0 ? 'pill--danger' : 'pill--warn';
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="cell-prod">
                            <img className="thumb" src={p.img} alt={p.nom} />
                            <div>
                              <div className="cell-prod__name">{p.nom}</div>
                              <div className="cell-prod__meta">{p.unite}</div>
                            </div>
                          </div>
                        </td>
                        <td className="tbl__num">
                          <span className={`pill ${cls}`}>
                            {p.stock <= 0 ? 'Rupture' : `${p.stock} u.`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
