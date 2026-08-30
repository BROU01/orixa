import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import { getProducts, getTheme, getMenu } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import ProductDetail from '@/components/ProductDetail';

interface ProduitPageProps {
  params: Promise<{ slug: string }>;
}

async function findProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: ProduitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return {};

  const description =
    product.description ||
    `${product.nom} — ${product.origine}, ${product.unite}. Disponible chez MAISON LA GRACE.`;
  const url = `${SITE_URL}/produit/${product.slug}`;
  const image = product.img.startsWith('http') ? product.img : `${SITE_URL}${product.img}`;

  return {
    title: product.nom,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: product.nom,
      description,
      images: [{ url: image, width: 1200, height: 1200, alt: product.nom }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.nom,
      description,
      images: [image],
    },
  };
}

/**
 * Page produit rendue côté serveur : les données sont disponibles dès la
 * première réponse et la fiche ne passe plus par un écran « Chargement ».
 */
export default async function ProduitPage({ params }: ProduitPageProps) {
  const { slug } = await params;

  const [products, menu, theme] = await Promise.all([
    getProducts(),
    getMenu(),
    getTheme(),
  ]);
  const product = products.find((item: Product) => item.slug === slug);

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nom,
    description: product.description,
    image: product.img.startsWith('http') ? product.img : `${SITE_URL}${product.img}`,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'MAISON LA GRACE' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produit/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.prix.toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} menu={menu} theme={theme} />
    </>
  );
}
