import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export type ActivityType = 'auth' | 'edit' | 'create' | 'system' | 'export' | 'delete';

export interface ActivityRow {
  id: string;
  created_at: string;
  actor: string;
  action: string;
  target: string | null;
  type: ActivityType;
}

/**
 * Journalise un évènement métier (best-effort). N'échoue jamais l'appelant :
 * une erreur d'écriture du journal ne doit pas casser la commande, l'avis
 * ou le message dont elle rend compte.
 */
export async function logActivity(actor: string, action: string, target: string, type: ActivityType = 'system'): Promise<void> {
  if (!isSupabaseAdminConfigured) return;
  try {
    await supabaseAdmin.from('activity_log').insert({ actor, action, target, type });
  } catch {
    /* le journal est un plus, jamais un bloquant */
  }
}

export async function listActivity(limit = 50): Promise<ActivityRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const { data, error } = await supabaseAdmin
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as ActivityRow[];
}
