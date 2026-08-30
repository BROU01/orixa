import { NextResponse } from 'next/server';
import { isRequestFromAdmin } from '@/lib/require-admin';
import { createSupplier } from '@/lib/suppliers';
import { logActivity } from '@/lib/activity';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

/** POST /api/admin/suppliers — Ajoute un fournisseur (admin uniquement). */
export async function POST(request: Request) {
  if (!(await isRequestFromAdmin())) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415 });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
  }

  const body = await request.json().catch(() => null);
  const nom = typeof body?.nom === 'string' ? body.nom.trim().slice(0, 120) : '';
  if (!nom) {
    return NextResponse.json({ error: 'Le nom du fournisseur est requis.' }, { status: 400 });
  }

  const ok = await createSupplier({
    nom,
    specialite: typeof body.specialite === 'string' ? body.specialite.trim().slice(0, 200) : undefined,
    contact: typeof body.contact === 'string' ? body.contact.trim().slice(0, 120) : undefined,
    email: typeof body.email === 'string' ? body.email.trim().slice(0, 254) : undefined,
    produits: Number.isFinite(Number(body.produits)) ? Number(body.produits) : undefined,
    delai: typeof body.delai === 'string' ? body.delai.trim().slice(0, 60) : undefined,
  });

  if (!ok) return NextResponse.json({ error: 'Impossible d’enregistrer le fournisseur.' }, { status: 500 });

  await logActivity('Admin', 'Ajouté un fournisseur', nom, 'create');
  return NextResponse.json({ success: true });
}
