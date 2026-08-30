import { listCustomersFromOrders } from '@/lib/orders';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import AdminClientsClient from './AdminClientsClient';
export const dynamic = 'force-dynamic';


/**
 * Page admin — Clients, dérivés de l'historique réel des commandes
 * (regroupées par e-mail) au lieu de données de démonstration statiques.
 */
export default async function AdminClientsPage() {
  const customers = await listCustomersFromOrders();

  return <AdminClientsClient customers={customers} supabaseConfigured={isSupabaseAdminConfigured} />;
}
