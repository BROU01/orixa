import { NextResponse } from 'next/server';
import { isRequestFromAdmin } from '@/lib/require-admin';
import { updateOrderStatus, ORDER_STATUSES, type OrderStatus } from '@/lib/orders';
import { logActivity } from '@/lib/activity';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** PATCH /api/admin/orders/[id] — Change le statut d'une commande (admin uniquement). */
export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isRequestFromAdmin())) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415 });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as OrderStatus | undefined;

  if (!status || !ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }

  const ok = await updateOrderStatus(id, status);
  if (!ok) {
    return NextResponse.json({ error: 'Impossible de mettre à jour la commande.' }, { status: 500 });
  }

  await logActivity('Admin', 'Modifié le statut de la commande', `#${id} → ${status}`, 'edit');
  return NextResponse.json({ success: true });
}
