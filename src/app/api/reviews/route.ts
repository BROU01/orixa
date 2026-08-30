import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';
import { createReview } from '@/lib/reviews';
import { logActivity } from '@/lib/activity';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { isBodyTooLarge, isJsonRequest } from '@/lib/request-security';

/** POST /api/reviews — Soumission publique d'un avis (mis en attente de modération). */
export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return NextResponse.json({ error: 'Type de contenu non pris en charge.' }, { status: 415 });
  }
  if (isBodyTooLarge(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
  }

  const key = getRateLimitKey(request, 'create-review');
  const { limited, retryAfter } = rateLimit(key, { windowMs: 60_000, max: 5 });
  if (limited) {
    return NextResponse.json(
      { error: 'Trop d’avis envoyés. Réessayez dans un instant.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId : '';
    const authorName = typeof body.authorName === 'string' ? body.authorName.trim().slice(0, 80) : '';
    const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 1000) : '';
    const rating = Number(body.rating);

    if (!authorName || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Avis invalide.' }, { status: 400 });
    }

    const products = await getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });
    }

    const ok = await createReview({ productId: product.id, productName: product.nom, authorName, rating, comment });
    if (!ok) {
      return NextResponse.json({ error: 'La modération des avis n’est pas configurée pour le moment.' }, { status: 503 });
    }

    await logActivity(authorName, 'Nouvel avis soumis', product.nom, 'create');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l’envoi de l’avis.' }, { status: 500 });
  }
}
