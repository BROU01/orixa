import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function saveContactMessage(input: CreateContactMessageInput): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;
  const { error } = await supabaseAdmin.from('contact_messages').insert({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    handled: false,
  });
  return !error;
}
