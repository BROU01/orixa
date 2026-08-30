import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase « service role » — usage SERVEUR UNIQUEMENT (jamais importé
 * par un composant 'use client'). Contourne les politiques RLS : réservé aux
 * routes API et composants serveur admin qui ont déjà vérifié l'identité de
 * l'appelant (cf. src/lib/require-admin.ts pour les écritures admin).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

function createSupabaseAdminClient(): SupabaseClient {
  if (!isSupabaseAdminConfigured) {
    return createClient('https://placeholder.supabase.co', 'placeholder', {
      auth: { persistSession: false },
    });
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabaseAdmin = createSupabaseAdminClient();
