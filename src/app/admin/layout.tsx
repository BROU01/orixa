import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

/**
 * Layout admin — Sidebar + zone de contenu principale.
 * Protégé par le middleware (server-side).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#f5f5f0' }}>
      <Sidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
