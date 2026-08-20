import { getProducts, getCategories } from '@/lib/data';
import type { Product, Category } from '@/types';

/**
 * Page admin — Gestion des produits.
 * Protégée par le middleware (server-side).
 */
export default async function AdminProduitsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const getCategoryLabel = (catId: string): string => {
    const cat = categories.find((c: Category) => c.id === catId);
    return cat ? cat.label : catId;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Produits
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {products.length} références au catalogue
          </p>
        </div>
        <button className="btn btn--primary btn--sm">
          + Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder="Rechercher un produit..."
              className="w-full px-3 py-2 text-sm border rounded-lg"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
          <select
            className="px-3 py-2 text-sm border rounded-lg"
            style={{ borderColor: 'var(--line)' }}
          >
            <option value="">Tous les rayons</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 text-sm border rounded-lg"
            style={{ borderColor: 'var(--line)' }}
          >
            <option value="">Tout le stock</option>
            <option value="low">Stock faible (&lt;35)</option>
            <option value="out">Rupture</option>
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Image</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Nom</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Rayon</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Provenance</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Prix</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Stock</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="p-3">
                    <img
                      src={product.img}
                      alt=""
                      className="w-10 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{product.nom}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{product.unite}</p>
                  </td>
                  <td className="p-3">{getCategoryLabel(product.cat)}</td>
                  <td className="p-3">{product.origine}</td>
                  <td className="p-3 text-right font-medium">{product.prix.toFixed(2)} €</td>
                  <td className="p-3 text-right">
                    <span
                      className={`pill ${
                        product.stock <= 0 ? 'pill--danger' :
                        product.stock < 35 ? 'pill--warn' : 'pill--ok'
                      }`}
                    >
                      {product.stock <= 0 ? 'Rupture' : `${product.stock}`}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="btn btn--secondary btn--sm">Modifier</button>
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
