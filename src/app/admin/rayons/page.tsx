import { getCategories, getProducts } from '@/lib/data';
import type { Category, Product } from '@/types';

/**
 * Page admin — Gestion des rayons du catalogue.
 * Protégée par le middleware (server-side).
 */
export default async function AdminRayonsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const countProducts = (catId: string): number =>
    products.filter((p: Product) => p.cat === catId).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Rayons
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Chaque rayon a sa page dédiée et son entrée dans la navigation.
          </p>
        </div>
        <button className="btn btn--primary btn--sm">
          + Ajouter un rayon
        </button>
      </div>

      {/* Info note */}
      <div className="card p-4 mb-6" style={{ background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Chaque rayon a sa page publique, <strong>générée automatiquement</strong> :
          <strong> cosmetiques</strong> et <strong> exotiques</strong> pour les pages dédiées,
          et la page <strong>rayon.html?id=…</strong> pour tout rayon créé ici.
          Le libellé, la description et les produits y sont toujours à jour.
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Rayon</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Page</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Description</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Produits</th>
                <th className="text-center p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Visibilité</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat: Category) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="p-3">
                    <strong>{cat.label}</strong>
                    {cat.color && (
                      <span className="ml-2 inline-block w-3 h-3 rounded-full" style={{ background: cat.color }} />
                    )}
                  </td>
                  <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.slug ? `/${cat.slug}` : `rayon.html?id=${cat.id}`}
                  </td>
                  <td className="p-3 text-xs max-w-[280px] truncate" style={{ color: 'var(--muted)' }}>
                    {cat.desc || '—'}
                  </td>
                  <td className="p-3 text-right">{countProducts(cat.id)}</td>
                  <td className="p-3 text-center">
                    <span className={`pill ${cat.on !== false ? 'pill--ok' : 'pill--neutral'}`}>
                      {cat.on !== false ? 'Visible' : 'Masqué'}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button className="btn btn--secondary btn--sm">Modifier</button>
                    <button className="btn btn--ghost btn--sm ml-1">Page</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-sm" style={{ color: 'var(--muted)' }}>Aucun rayon. Créez-en un.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
