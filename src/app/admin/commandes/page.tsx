import { listOrders } from '@/lib/orders';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import AdminCommandesClient from './AdminCommandesClient';
export const dynamic = 'force-dynamic';


/**
 * Page admin — Gestion des commandes.
 * Lit les commandes réellement enregistrées via /api/orders (table Supabase
 * `orders`) au lieu de données de démonstration.
 */
export default async function AdminCommandesPage() {
  const orders = await listOrders();

  return (
    <AdminCommandesClient
      initialOrders={orders}
      supabaseConfigured={isSupabaseAdminConfigured}
    />
  );
}
