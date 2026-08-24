import { supabase } from './supabase';
import type {
  Product, Category, Theme, MenuItem, Section,
  Discount, Collection, Article, Page, Media, AdminUser, AdminRole,
} from '@/types';

/**
 * Récupère les données CMS depuis Supabase (côté serveur).
 * En mode build, retourne les données par défaut.
 */

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'karite', nom: 'Beurre de karité pur', slug: 'beurre-de-karite', prix: 18.90, img: '/products/cosmetics/beurre-de-karite.jpg', cat: 'cosmetics', unite: 'Pot 200 ml', origine: 'Burkina Faso', stock: 45, badge: '', description: 'Beurre de karité 100% pur, issu de la coopérative de femmes de Koudougou. Hydratant intense pour peaux sèches et abîmées.' },
  { id: 'gari', nom: 'Gari précuit', slug: 'gari-precuit', prix: 4.50, img: '/products/exotic/gari.jpeg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Côte d\'Ivoire', stock: 120, badge: '', description: 'Gari précuit traditionnel, prêt à consommer. Accompagne vos plats et sauces.' },
  { id: 'hibiscus', nom: 'Fleurs d\'hibiscus séchées', slug: 'hibiscus', prix: 6.80, img: '/products/exotic/hibiscus.jpg', cat: 'exotic', unite: 'Sac 150 g', origine: 'Sénégal', stock: 88, badge: 'Nouveau', description: 'Fleurs d\'hibiscus séchées pour tisanes et boissons. Riche en vitamines et antioxydants.' },
  { id: 'gombo-moulu', nom: 'Gombo moulu', slug: 'gombo-moulu', prix: 3.90, img: '/products/exotic/gombo-moulu.png', cat: 'exotic', unite: 'Sac 200 g', origine: 'Cameroun', stock: 67, badge: '', description: 'Gombo séché et moulu, idéal pour les sauces et ragoûts traditionnels.' },
  { id: 'pommade', nom: 'Pommade au karité', slug: 'pommade-karite', prix: 12.50, img: '/products/cosmetics/pommade.jpg', cat: 'cosmetics', unite: 'Pot 100 ml', origine: 'Burkina Faso', stock: 34, badge: '', description: 'Pommade réparatrice au karité et huile de coco. Cicatrisante et protectrice.' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cosmetics', label: 'Cosmétiques', slug: 'cosmetiques', color: '#C9A84C', desc: 'Soins naturels, maquillage et parfums.', on: true },
  { id: 'exotic', label: 'Produits exotiques', slug: 'exotiques', color: '#6FD08B', desc: 'Ingrédients rares et saveurs d\'ailleurs.', on: true },
];

const DEFAULT_THEME: Theme = {
  brand: '#111110',
  paper: '#FBFAF6',
  text: '#2C2C2C',
  accent: '#C9A84C',
  announce: 'Livraison offerte dès 80 € d\'achat',
  announceOn: true,
  footerAbout: 'MAISON LA GRACE — Cosmétiques naturels et produits exotiques. Maison française, livraison partout en Europe.',
};

const DEFAULT_MENU: MenuItem[] = [
  { label: 'Boutique', url: '/cosmetiques', on: true, children: [
    { label: 'Cosmétiques', url: '/cosmetiques', on: true },
    { label: 'Produits exotiques', url: '/exotiques', on: true },
    { label: 'Nouveautés', url: '/nouveautes', on: true },
  ]},
  { label: 'Notre histoire', url: '/histoire', on: true },
  { label: 'Contact', url: '/contact', on: true },
];

const DEFAULT_SECTIONS: Section[] = [
  { id: 'hero', type: 'hero', title: 'Bienvenue chez MAISON LA GRACE', subtitle: 'Cosmétiques naturels & produits exotiques' },
  { id: 'featured', type: 'products', title: 'Nos best-sellers', productIds: ['karite', 'gari', 'hibiscus'] },
];

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: 'col-1', titre: 'Coffrets cadeaux', slug: 'coffrets-cadeaux', on: true, desc: 'Nos sélections offertes pour toutes les occasions.', ids: ['karite', 'pommade'] },
  { id: 'col-2', titre: 'Nouveautés été', slug: 'nouveautes-ete', on: true, desc: 'Les dernières arrivées de la saison.', ids: ['hibiscus', 'gombo-moulu'] },
];

/** Codes promo : illimités et renouvelables chaque année */
const DEFAULT_DISCOUNTS: Discount[] = [
  { id: 'red-1', code: 'BIENVENUE10', type: 'pct', valeur: 10, min: 30, actif: true, usages: 24, limite: 0, fin: '' },
  { id: 'red-2', code: 'LIVRAISON', type: 'liv', valeur: 0, min: 80, actif: true, usages: 156, limite: 0, fin: '' },
  { id: 'red-3', code: 'MLG15', type: 'pct', valeur: 15, min: 60, actif: true, usages: 0, limite: 0, fin: '' },
];

const DEFAULT_ARTICLES: Article[] = [
  { id: 'art-1', titre: 'Bienvenue chez MAISON LA GRACE', slug: 'bienvenue', statut: 'publie', date: '2026-01-15', extrait: 'Découvrez notre histoire et nos engagements.', image: '', contenu: '<p>MAISON LA GRACE est née de la passion pour les trésors naturels d\'Afrique.</p>' },
];

const DEFAULT_PAGES: Page[] = [
  { id: 'histoire', titre: 'Notre histoire', slug: 'histoire', statut: 'publie', contenu: '<p>MAISON LA GRACE — une histoire de passion et de transmission.</p>' },
  { id: 'contact', titre: 'Contact', slug: 'contact', statut: 'publie', contenu: '<p>Nous sommes à votre écoute.</p>' },
  { id: 'legal', titre: 'Informations légales', slug: 'legal', statut: 'publie', contenu: '<p>Mentions légales et CGV.</p>' },
];

const DEFAULT_MEDIA: Media[] = [
  /* ── Cosmétiques ── */
  { src: '/products/cosmetics/beurre-de-karite.jpg', name: 'beurre-de-karite.jpg', builtin: true },
  { src: '/products/cosmetics/blush.jpg', name: 'blush.jpg', builtin: true },
  { src: '/products/cosmetics/crayon-a-sourcils-blond.jpg', name: 'crayon-a-sourcils-blond.jpg', builtin: true },
  { src: '/products/cosmetics/faux-cils.jpg', name: 'faux-cils.jpg', builtin: true },
  { src: '/products/cosmetics/faux-ongles.jpg', name: 'faux-ongles.jpg', builtin: true },
  { src: '/products/cosmetics/gel.jpg', name: 'gel.jpg', builtin: true },
  { src: '/products/cosmetics/mascara.jpg', name: 'mascara.jpg', builtin: true },
  { src: '/products/cosmetics/masque-facial.jpg', name: 'masque-facial.jpg', builtin: true },
  { src: '/products/cosmetics/parfum.jpg', name: 'parfum.jpg', builtin: true },
  { src: '/products/cosmetics/pommade.jpg', name: 'pommade.jpg', builtin: true },
  { src: '/products/cosmetics/rouge-a-levre.jpg', name: 'rouge-a-levre.jpg', builtin: true },
  { src: '/products/cosmetics/vernis-a-ongles.jpg', name: 'vernis-a-ongles.jpg', builtin: true },
  /* ── Produits exotiques ── */
  { src: '/products/exotic/aklui.jpg', name: 'aklui.jpg', builtin: true },
  { src: '/products/exotic/attieke.jpg', name: 'attieke.jpg', builtin: true },
  { src: '/products/exotic/aubergine-blanche.jpg', name: 'aubergine-blanche.jpg', builtin: true },
  { src: '/products/exotic/banane-plantain.jpg', name: 'banane-plantain.jpg', builtin: true },
  { src: '/products/exotic/cossete-igname.webp', name: 'cossete-igname.webp', builtin: true },
  { src: '/products/exotic/cube-maggi-poulet.jpg', name: 'cube-maggi-poulet.jpg', builtin: true },
  { src: '/products/exotic/farine-d-haricot.jpg', name: 'farine-d-haricot.jpg', builtin: true },
  { src: '/products/exotic/gari.jpeg', name: 'gari.jpeg', builtin: true },
  { src: '/products/exotic/gombo-moulu.png', name: 'gombo-moulu.png', builtin: true },
  { src: '/products/exotic/gombo.jpg', name: 'gombo.jpg', builtin: true },
  { src: '/products/exotic/hibiscus.jpg', name: 'hibiscus.jpg', builtin: true },
  { src: '/products/exotic/igname.jpg', name: 'igname.jpg', builtin: true },
  { src: '/products/exotic/koms.jpg', name: 'koms.jpg', builtin: true },
  { src: '/products/exotic/manioc.jpg', name: 'manioc.jpg', builtin: true },
  { src: '/products/exotic/piments.jpg', name: 'piments.jpg', builtin: true },
  { src: '/products/exotic/tapioca.jpeg', name: 'tapioca.jpeg', builtin: true },
];

const DEFAULT_USERS: AdminUser[] = [
  { id: 'u-1', nom: 'Kalipé G.', email: 'kalipe@orixa.fr', role: 'owner', actif: true, derniereVisite: '2026-08-19' },
];

const DEFAULT_ROLES: AdminRole[] = [
  { id: 'owner', label: 'Propriétaire', permissions: ['Tout'] },
  { id: 'admin', label: 'Administrateur', permissions: ['Catalogue', 'Commandes', 'Clients', 'Pages', 'Paramètres'] },
  { id: 'editor', label: 'Éditeur', permissions: ['Catalogue', 'Pages', 'Articles'] },
  { id: 'viewer', label: 'Lecteur', permissions: ['Consultation uniquement'] },
];

/** Generic CMS fetcher */
async function fetchCms<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from('cms')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data?.value) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

export async function getProducts(): Promise<Product[]> {
  return fetchCms('orixa:products', DEFAULT_PRODUCTS);
}

export async function getCategories(): Promise<Category[]> {
  return fetchCms('orixa:categories', DEFAULT_CATEGORIES);
}

export async function getTheme(): Promise<Theme> {
  const theme = await fetchCms<Partial<Theme>>('orixa:theme', DEFAULT_THEME);
  return { ...DEFAULT_THEME, ...theme };
}

export async function getMenu(): Promise<MenuItem[]> {
  return fetchCms('orixa:menu:v2', DEFAULT_MENU);
}

export async function getSections(): Promise<Section[]> {
  return fetchCms('orixa:sections:v2', DEFAULT_SECTIONS);
}

export async function getCollections(): Promise<Collection[]> {
  return fetchCms('orixa:collections', DEFAULT_COLLECTIONS);
}

export async function getDiscounts(): Promise<Discount[]> {
  return fetchCms('orixa:discounts', DEFAULT_DISCOUNTS);
}

export async function getArticles(): Promise<Article[]> {
  return fetchCms('orixa:articles', DEFAULT_ARTICLES);
}

export async function getPages(): Promise<Page[]> {
  return fetchCms('orixa:pages', DEFAULT_PAGES);
}

export async function getMedia(): Promise<Media[]> {
  return fetchCms('orixa:media', DEFAULT_MEDIA);
}

export async function getUsers(): Promise<AdminUser[]> {
  return fetchCms('orixa:users', DEFAULT_USERS);
}

export async function getRoles(): Promise<AdminRole[]> {
  return fetchCms('orixa:roles', DEFAULT_ROLES);
}
