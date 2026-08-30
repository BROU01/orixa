import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export interface ReviewRow {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  author_name: string;
  rating: number;
  comment: string;
  approved: boolean;
}

export interface CreateReviewInput {
  productId: string;
  productName: string;
  authorName: string;
  rating: number;
  comment: string;
}

export async function createReview(input: CreateReviewInput): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;
  const { error } = await supabaseAdmin.from('reviews').insert({
    product_id: input.productId,
    product_name: input.productName,
    author_name: input.authorName,
    rating: input.rating,
    comment: input.comment,
    approved: false,
  });
  return !error;
}

export async function listReviews(): Promise<ReviewRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as ReviewRow[];
}

export async function listApprovedReviewsForProduct(productId: string): Promise<ReviewRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as ReviewRow[];
}

export async function setReviewApproved(id: string, approved: boolean): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;
  const { error } = await supabaseAdmin.from('reviews').update({ approved }).eq('id', id);
  return !error;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;
  const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
  return !error;
}
