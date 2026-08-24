'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import type { ReactNode } from 'react';

/**
 * Shell admin — grille 2 colonnes fidèle au projet original.
 * La sidebar est masquée sur /admin/login.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <header className="topbar">
          <h1 className="topbar__title">Administration</h1>
          <div className="topbar__actions">
            <a className="b b--default b--sm" href="/" target="_blank" rel="noopener noreferrer">
              Voir la boutique
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </header>
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
