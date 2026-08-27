import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import { getProducts, getTheme, getMenu } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';

interface ProduitPageProps {
  searchParams: {
    id?: string;
  };
}

/**
 * Page produit rendue côté serveur : les données sont disponibles dès la
 * première réponse et la fiche ne passe plus par un écran « Chargement ».
 */
export default async function ProduitPage({ searchParams }: ProduitPageProps) {
  const id = searchParams.id;
  if (!id) notFound();

  const [products, menu, theme] = await Promise.all([
    getProducts(),
    getMenu(),
    getTheme(),
  ]);
  const product = products.find((item: Product) => item.id === id);

  if (!product) notFound();

  return <ProductDetail product={product} menu={menu} theme={theme} />;
}
