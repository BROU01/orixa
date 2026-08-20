import { getPages } from '@/lib/data';
import type { Page } from '@/types';

const PAGE_ROUTES: Record<string, string> = {
  histoire: '/histoire',
  contact: '/contact',
  legal: '/legal',
};

/**
 * Page admin — Gestion des pages statiques.
 * Protégée par le middleware (server-side).
 */
export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Pages
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Modifiez le contenu des pages statiques de la boutique.
          </p>
        </div>
      </div>

      {/* Info note */}
      <div className="card p-4 mb-6" style={{ background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          La page d&apos;accueil se compose par sections via{' '}
          <a href="/admin/personnalisation" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Personnalisation
          </a>. Les autres pages s&apos;éditent ici.
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Page</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Adresse</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Composition</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Page d'accueil (spéciale) */}
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td className="p-3"><strong>Accueil</strong></td>
                <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>/</td>
                <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>Sections dynamiques</td>
                <td className="p-3 text-right">
                  <a href="/admin/personnalisation" className="btn btn--primary btn--sm">Composer</a>
                </td>
              </tr>

              {/* Boutique (spéciale) */}
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td className="p-3"><strong>Boutique</strong></td>
                <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>/boutique</td>
                <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>Catalogue dynamique</td>
                <td className="p-3 text-right">
                  <a href="/admin/produits" className="btn btn--secondary btn--sm">Gérer les produits</a>
                </td>
              </tr>

              {/* Pages éditables */}
              {pages.map((page: Page) => (
                <tr
                  key={page.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="p-3"><strong>{page.titre}</strong></td>
                  <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {PAGE_ROUTES[page.slug] || `/${page.slug}`}
                  </td>
                  <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                    Éditable
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
