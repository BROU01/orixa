import { getProducts, getCategories } from '@/lib/data';
import type { Product, Category } from '@/types';

/**
 * Page admin — Inventaire / Stock.
 * Mouvements de stock, seuils d'alerte, historique.
 */
export default async function AdminInventairePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const getCatLabel = (catId: string) => categories.find((c: Category) => c.id === catId)?.label || catId;
  const rupture = products.filter(p => p.stock <= 0);
  const faible = products.filter(p => p.stock > 0 && p.stock < 35);
  const valeurStock = products.reduce((a, p) => a + p.stock * p.prix, 0);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Inventaire</h2>
          <p className="page-sub">Gestion des stocks et seuils d&apos;alerte.</p>
        </div>
        <button className="b b--default">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Exporter CSV
        </button>
      </div>

      <div className="kpis" style={{ marginBottom: '24px' }}>
        <div className="kpi">
          <p className="kpi__label">Valeur totale du stock</p>
          <p className="kpi__value">{valeurStock.toLocaleString('fr-FR')} <span style={{ fontSize: '14px', fontWeight: 600 }}>€</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Références en rupture</p>
          <p className="kpi__value" style={{ color: rupture.length > 0 ? 'var(--a-danger)' : undefined }}>{rupture.length}</p>
          <p className="kpi__delta" style={{ color: 'var(--a-muted)' }}><span className="kpi__note">à réapprovisionner</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Stock faible (&lt;35 u.)</p>
          <p className="kpi__value" style={{ color: 'var(--a-warn)' }}>{faible.length}</p>
          <p className="kpi__delta" style={{ color: 'var(--a-muted)' }}><span className="kpi__note">sous le seuil</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Taux de rupture</p>
          <p className="kpi__value">{products.length ? Math.round(rupture.length / products.length * 100) : 0}%</p>
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <h3 className="card__title">Articles à surveiller</h3>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Rayon</th>
                <th className="tbl__num">Stock</th>
                <th className="tbl__num">Prix</th>
                <th className="tbl__num">Valeur</th>
                <th style={{ textAlign: 'center' }}>État</th>
                <th className="tbl__num">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.stock <= 35).sort((a, b) => a.stock - b.stock).map((p: Product) => (
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
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{getCatLabel(p.cat)}</td>
                  <td className="tbl__num" style={{ fontWeight: 600, color: p.stock === 0 ? 'var(--a-danger)' : 'var(--a-warn)' }}>{p.stock}</td>
                  <td className="tbl__num">{p.prix.toFixed(2)} €</td>
                  <td className="tbl__num">{(p.stock * p.prix).toFixed(2)} €</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`pill ${p.stock === 0 ? 'pill--danger' : 'pill--warn'}`}>
                      {p.stock === 0 ? 'Rupture' : 'Faible'}
                    </span>
                  </td>
                  <td className="tbl__num">
                    <button className="b b--default b--sm">Ajuster</button>
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
