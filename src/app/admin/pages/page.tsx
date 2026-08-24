import { getPages } from '@/lib/data';
import type { Page } from '@/types';

const PAGE_ROUTES: Record<string, string> = {
  histoire: '/histoire',
  contact: '/contact',
  legal: '/legal',
  cgv: '/cgv',
  'mentions-legales': '/mentions-legales',
  confidentialite: '/confidentialite',
  cookies: '/cookies',
  faq: '/faq',
  retour: '/retours',
};

/**
 * Page admin — Gestion des pages statiques.
 * Fidèle au projet orixa-site-complet original.
 */
export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Pages</h2>
          <p className="page-sub">Modifiez le contenu des pages statiques de la boutique.</p>
        </div>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          La page d&apos;accueil se compose par sections via{' '}
          <a href="/admin/personnalisation" style={{ fontWeight: 600, color: 'var(--a-brand)' }}>
            Personnalisation
          </a>. Les autres pages s&apos;éditent ici.
        </span>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Page</th>
                <th>Adresse</th>
                <th>Composition</th>
                <th className="tbl__num">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Accueil</strong></td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>/</td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>Sections dynamiques</td>
                <td className="tbl__num">
                  <a href="/admin/personnalisation" className="b b--primary b--sm">Composer</a>
                </td>
              </tr>
              <tr>
                <td><strong>Cosmétiques</strong></td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>/cosmetiques</td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>Catalogue dynamique</td>
                <td className="tbl__num">
                  <a href="/admin/produits" className="b b--default b--sm">Gérer les produits</a>
                </td>
              </tr>
              <tr>
                <td><strong>Produits exotiques</strong></td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>/exotiques</td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>Catalogue dynamique</td>
                <td className="tbl__num">
                  <a href="/admin/produits" className="b b--default b--sm">Gérer les produits</a>
                </td>
              </tr>
              <tr>
                <td><strong>Nouveautés</strong></td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>/nouveautes</td>
                <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>Catalogue dynamique</td>
                <td className="tbl__num">
                  <a href="/admin/produits" className="b b--default b--sm">Gérer les produits</a>
                </td>
              </tr>
              {pages.map((page: Page) => (
                <tr key={page.id}>
                  <td><strong>{page.titre}</strong></td>
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>
                    {PAGE_ROUTES[page.slug] || '/' + page.slug}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>Éditable</td>
                  <td className="tbl__num">
                    <a href={PAGE_ROUTES[page.slug] || '/' + page.slug} className="b b--default b--sm" target="_blank" rel="noopener noreferrer">Voir</a>
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
