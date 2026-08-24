import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout — Déconnexion admin.
 * Supprime le cookie de session et redirige vers /admin/login.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  // Supprimer le cookie admin-session
  response.cookies.set('orixa:admin-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
