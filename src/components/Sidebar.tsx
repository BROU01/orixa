'use client';

import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_ITEMS: NavGroup[] = [
  { group: 'Pilotage', items: [
    { label: 'Tableau de bord', href: '/admin' },
    { label: 'Commandes', href: '/admin/commandes' },
    { label: 'Clients', href: '/admin/clients' },
  ]},
  { group: 'Catalogue', items: [
    { label: 'Produits', href: '/admin/produits' },
    { label: 'Rayons', href: '/admin/rayons' },
    { label: 'Collections', href: '/admin/collections' },
    { label: 'Réductions', href: '/admin/reductions' },
  ]},
  { group: 'Boutique en ligne', items: [
    { label: 'Personnalisation', href: '/admin/personnalisation' },
    { label: 'Menus', href: '/admin/menus' },
    { label: 'Médiathèque', href: '/admin/medias' },
    { label: 'Articles', href: '/admin/articles' },
    { label: 'Pages', href: '/admin/pages' },
  ]},
  { group: 'Administration', items: [
    { label: 'Utilisateurs', href: '/admin/utilisateurs' },
    { label: 'Réglages', href: '/admin/reglages' },
  ]},
];

const ICONS: Record<string, JSX.Element> = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  'file-text': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  'shopping-bag': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  percent: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><line x1="5" y1="19" x2="19" y2="5"/></svg>,
  palette: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="13" y2="18"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

const ICON_MAP: Record<string, string> = {
  '/admin': 'grid',
  '/admin/commandes': 'file-text',
  '/admin/clients': 'users',
  '/admin/produits': 'shopping-bag',
  '/admin/rayons': 'grid',
  '/admin/collections': 'layers',
  '/admin/reductions': 'percent',
  '/admin/personnalisation': 'palette',
  '/admin/menus': 'menu',
  '/admin/medias': 'image',
  '/admin/articles': 'book',
  '/admin/pages': 'file',
  '/admin/utilisateurs': 'user',
  '/admin/reglages': 'settings',
};

/**
 * Composant Sidebar admin réutilisable.
 * Affiche la navigation latérale du back-office.
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col"
      style={{ background: 'var(--brand)', color: 'var(--paper)' }}
    >
      {/* Brand */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <a href="/admin" className="text-lg font-bold block" style={{ fontFamily: 'var(--f-display)' }}>
          ORIXA
        </a>
        <span className="text-xs opacity-60">Administration</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2 opacity-50">
              {group.group}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname === item.href + '/';
              const iconName = ICON_MAP[item.href] || 'grid';
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5"
                  style={{
                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: active ? 'var(--accent)' : 'rgba(255,255,255,0.75)',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span className="w-4 h-4 opacity-70">
                    {ICONS[iconName] || ICONS.grid}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--brand)' }}>
            KG
          </span>
          <span className="text-xs opacity-75">Kalipé G.</span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          Voir la boutique →
        </a>
      </div>
    </aside>
  );
}
