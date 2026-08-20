import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Client Supabase — tolerate les env vars manquantes.
 * Si les credentials ne sont pas configurés, le client retourne
 * des données vides au lieu de crasher le build.
 */
function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Retourne un client factice qui ne fait rien
    // Les pages server-side utiliseront les données par défaut
    return createClient('https://placeholder.supabase.co', 'placeholder', {
      auth: { persistSession: false },
    });
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
    },
  });
}

export const supabase = createSupabaseClient();

/**
 * Vérifie si l'utilisateur connecté est admin.
 * Utilisée par le middleware et les pages admin.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return false;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@2026.fr';
    return session.user.email?.toLowerCase() === adminEmail.toLowerCase();
  } catch {
    return false;
  }
}
