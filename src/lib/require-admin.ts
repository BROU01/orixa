import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { verifyAdminSessionToken } from '@/lib/admin-session';

/**
 * Vérifie côté serveur (route handler / server action) que l'appelant est
 * bien l'administrateur — même logique que src/proxy.ts, mais réutilisable
 * dans les routes API que le proxy ne couvre pas (il ne matche que /admin/*).
 */
export async function isRequestFromAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@2026.fr';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const session = await verifyAdminSessionToken(cookieStore.get('orixa:admin-session')?.value);
    return !!session && session.email.toLowerCase() === adminEmail.trim().toLowerCase();
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() { /* pas de rafraîchissement de session ici */ },
          remove() { /* pas de rafraîchissement de session ici */ },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return !!user && user.email?.toLowerCase() === adminEmail.toLowerCase();
  } catch {
    return false;
  }
}
