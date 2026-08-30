import { listReviews } from '@/lib/reviews';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import AdminAvisClient from './AdminAvisClient';
export const dynamic = 'force-dynamic';


/**
 * Page admin — Avis clients, lus depuis la table Supabase `reviews`
 * (soumis publiquement via /api/reviews) au lieu de données de démonstration.
 */
export default async function AdminAvisPage() {
  const reviews = await listReviews();
  return <AdminAvisClient initialReviews={reviews} supabaseConfigured={isSupabaseAdminConfigured} />;
}
