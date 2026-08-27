import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { verifyAdminSessionToken } from '@/lib/admin-session';

/**
 * Proxy Next.js — PROTÉGÉ SERVEUR DU PANNEAU ADMIN.
 *
 * Contrairement au site statique (HTML/JS), ici la garde est
 * exécutée CÔTÉ SERVEUR avant que le HTML ne soit envoyé au navigateur.
 * Un visiteur non authentifié ne voit JAMAIS le code admin.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Seules les routes /admin/* sont protégées (sauf /admin/login)
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/login/';

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Mode démo : l’accès reste protégé par une session HMAC serveur.
  // Si le secret manque ou si le cookie est invalide, l’accès est refusé.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const session = await verifyAdminSessionToken(request.cookies.get('orixa:admin-session')?.value);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@2026.fr';
    if (!session || session.email.toLowerCase() !== adminEmail.trim().toLowerCase()) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  try {
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: Record<string, unknown>) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Rafraîchir la session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Vérifier que c'est bien l'admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@2026.fr';
    const isUserAdmin =
      user?.email?.toLowerCase() === adminEmail.toLowerCase();

    if (!user || !isUserAdmin) {
      // Rediriger vers la page de connexion admin
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  } catch {
    // En cas d’erreur d’authentification, ne jamais ouvrir l’accès par défaut.
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
