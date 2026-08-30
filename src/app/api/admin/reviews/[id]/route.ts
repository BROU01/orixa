import { NextResponse } from 'next/server';
import { isRequestFromAdmin } from '@/lib/require-admin';
import { setReviewApproved, deleteReview } from '@/lib/reviews';
import { logActivity } from '@/lib/activity';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** PATCH /api/admin/reviews/[id] — Approuve ou masque un avis (admin uniquement). */
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
  if (typeof body?.approved !== 'boolean') {
    return NextResponse.json({ error: 'Paramètre invalide.' }, { status: 400 });
  }

  const ok = await setReviewApproved(id, body.approved);
  if (!ok) return NextResponse.json({ error: 'Échec de la mise à jour.' }, { status: 500 });

  await logActivity('Admin', body.approved ? 'Avis approuvé' : 'Avis masqué', `#${id}`, 'edit');
  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/reviews/[id] — Supprime un avis signalé (admin uniquement). */
export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isRequestFromAdmin())) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteReview(id);
  if (!ok) return NextResponse.json({ error: 'Échec de la suppression.' }, { status: 500 });

  await logActivity('Admin', 'Avis supprimé', `#${id}`, 'delete');
  return NextResponse.json({ success: true });
}
