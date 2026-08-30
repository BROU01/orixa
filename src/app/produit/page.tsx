import { notFound, permanentRedirect } from 'next/navigation';
import type { Product } from '@/types';
import { getProducts } from '@/lib/data';

interface ProduitPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

/**
 * Ancienne URL `/produit?id=...` — conservée pour ne pas casser les liens déjà
 * partagés ou indexés. Redirige de façon permanente vers `/produit/[slug]`.
 */
export default async function ProduitLegacyPage({ searchParams }: ProduitPageProps) {
  const { id } = await searchParams;
  if (!id) notFound();

  const products = await getProducts();
  const product = products.find((item: Product) => item.id === id);

  if (!product) notFound();

  permanentRedirect(`/produit/${product.slug}`);
}
