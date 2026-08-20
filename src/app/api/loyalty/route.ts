import { NextResponse } from 'next/server';

/**
 * POST /api/loyalty — Traiter une commande payée
 * Body: { action: 'process', orderSubtotal: number, orderId: string }
 * Body: { action: 'refund', orderId: string }
 * Body: { action: 'validate-voucher', code: string }
 * Body: { action: 'apply-voucher', subtotal: number, shipping: number, voucherId: string }
 *
 * Note: En mode build sans Supabase, la logique côté client gère
 * le localStorage. Cette route est un hook pour une future DB.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Pour l'instant, le client gère la logique via localStorage.
    // Cette route servira de pont vers une DB quand Supabase sera connecté.
    return NextResponse.json({
      success: true,
      message: `Action "${action}" traitée côté client.`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la fidélité.' },
      { status: 500 },
    );
  }
}
