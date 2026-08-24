import { ReactNode } from 'react';
import AdminShell from '@/components/AdminShell';
import './admin.css';

/**
 * Layout admin — Sidebar + zone de contenu principale.
 * Protégé par le middleware (server-side).
 * La sidebar est masquée sur /admin/login via AdminShell.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
