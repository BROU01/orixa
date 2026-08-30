import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export interface SupplierRow {
  id: string;
  created_at: string;
  nom: string;
  specialite: string | null;
  contact: string | null;
  email: string | null;
  produits: number;
  delai: string | null;
  actif: boolean;
}

export interface CreateSupplierInput {
  nom: string;
  specialite?: string;
  contact?: string;
  email?: string;
  produits?: number;
  delai?: string;
}

export async function listSuppliers(): Promise<SupplierRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as SupplierRow[];
}

export async function createSupplier(input: CreateSupplierInput): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;
  const { error } = await supabaseAdmin.from('suppliers').insert({
    nom: input.nom,
    specialite: input.specialite || null,
    contact: input.contact || null,
    email: input.email || null,
    produits: input.produits || 0,
    delai: input.delai || null,
    actif: true,
  });
  return !error;
}
