import { getProducts, getCategories } from '@/lib/data';

/**
 * Tableau de bord admin — Vue d'ensemble.
 * Les KPI sont calculés côté serveur.
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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Tableau de bord
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Vue d&apos;ensemble des 30 derniers jours.
          </p>
        </div>
        <a href="/admin/produits" className="btn btn--primary btn--sm">
          + Ajouter un produit
        </a>
      </div>

      {/* Note */}
      <div
        className="mb-6 p-4 rounded-xl text-sm flex items-start gap-3"
        style={{
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.3)',
        }}
      >
        <span className="text-lg">⚠️</span>
        <p>
          Chiffre d&apos;affaires, commandes et clients sont des données de démonstration statiques.
          Le catalogue, le thème et les contenus sont réellement modifiables.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>Références au catalogue</p>
          <p className="text-2xl font-semibold">{totalProducts}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {outOfStock === 0 ? 'Aucune rupture' : `${outOfStock} en rupture`}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>Stock faible</p>
          <p className="text-2xl font-semibold">{lowStock}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--warning)' }}>
            produits sous 35 unités
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>Catégories</p>
          <p className="text-2xl font-semibold">{categories.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            rayons actifs
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>Ruptures</p>
          <p className="text-2xl font-semibold">{outOfStock}</p>
          <p className="text-xs mt-1" style={{ color: outOfStock > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {outOfStock > 0 ? 'à réapprovisionner' : 'tout est en stock'}
          </p>
        </div>
      </div>

      {/* Produits par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-medium mb-4" style={{ fontFamily: 'var(--f-display)' }}>
            Répartition par rayon
          </h3>
          <div className="space-y-3">
            {categories.map((cat) => {
              const count = products.filter((p) => p.cat === cat.id).length;
              const pct = totalProducts ? Math.round((count / totalProducts) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.label}</span>
                    <span style={{ color: 'var(--muted)' }}>{count} · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--line)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: cat.color || 'var(--accent)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-medium mb-4" style={{ fontFamily: 'var(--f-display)' }}>
            Stock faible
          </h3>
          <div className="space-y-3">
            {products
              .filter((p) => p.stock <= 35)
              .sort((a, b) => a.stock - b.stock)
              .slice(0, 6)
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.img}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{p.nom}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{p.unite}</p>
                    </div>
                  </div>
                  <span
                    className={`pill ${p.stock <= 0 ? 'pill--danger' : 'pill--warn'}`}
                  >
                    {p.stock <= 0 ? 'Rupture' : `${p.stock} unités`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
