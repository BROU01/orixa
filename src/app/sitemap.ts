import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';
import { SITE_URL as BASE } from '@/lib/site';

/** Pages statiques publiques */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/cosmetiques`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/exotiques`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/nouveautes`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/histoire`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/nos-valeurs`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/contact`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/faq`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/retours`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/paiements-securises`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE}/legal`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/cgv`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  { url: `${BASE}/confidentialite`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  { url: `${BASE}/cookies`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  { url: `${BASE}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages produits dynamiques
  const products = await getProducts();

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/produit/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...STATIC_PAGES, ...productPages];
}
