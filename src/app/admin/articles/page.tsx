import { getArticles } from '@/lib/data';
import type { Article } from '@/types';

/**
 * Page admin — Gestion des articles (blog/journal).
 * Protégée par le middleware (server-side).
 */
export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Articles
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Journal de la boutique.
          </p>
        </div>
        <button className="btn btn--primary btn--sm">
          + Nouvel article
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Article</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Date</th>
                <th className="text-center p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Statut</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art: Article) => (
                <tr
                  key={art.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="p-3">
                    <p className="font-medium">{art.titre}</p>
                    <p className="text-xs truncate max-w-[300px]" style={{ color: 'var(--muted)' }}>
                      {art.extrait || '—'}
                    </p>
                  </td>
                  <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {art.date}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`pill ${art.statut === 'publie' ? 'pill--ok' : 'pill--warn'}`}>
                      {art.statut === 'publie' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="btn btn--secondary btn--sm">Modifier</button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  Aucun article.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
