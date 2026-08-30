import { listSuppliers } from '@/lib/suppliers';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import AdminFournisseursClient from './AdminFournisseursClient';
export const dynamic = 'force-dynamic';


/**
 * Page admin — Fournisseurs, lus depuis la table Supabase `suppliers`
 * au lieu de données de démonstration statiques.
 */
export default async function AdminFournisseursPage() {
  const suppliers = await listSuppliers();
  return <AdminFournisseursClient initialSuppliers={suppliers} supabaseConfigured={isSupabaseAdminConfigured} />;
}
