/**
 * MAISON LA GRACE — Types TypeScript
 * Types partagés entre les composants client et serveur.
 */

export interface Product {
  id: string;
  nom: string;
  slug: string;
  prix: number;
  img: string;
  cat: string;
  unite: string;
  origine: string;
  stock: number;
  badge?: 'Nouveau' | 'Promo' | '';
  description?: string;
  labelImg?: string;  // Photo d'étiquette (optionnel) — affichée au hover de la carte
}

export interface Category {
  id: string;
  label: string;
  slug: string;
  color?: string;
  desc?: string;
  image?: string;
  on?: boolean;
}

export interface Theme {
  brand: string;
  paper: string;
  text: string;
  accent: string;
  announce?: string;
  announceOn?: boolean;
  footerAbout?: string;
}

export interface MenuItem {
  label: string;
  url: string;
  on?: boolean;
  children?: MenuItem[];
}

export interface Section {
  id: string;
  type: 'hero' | 'products' | 'banner' | 'newsletter' | 'text';
  title?: string;
  subtitle?: string;
  productIds?: string[];
  image?: string;
  link?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'pct' | 'fixe' | 'liv';
  valeur: number;
  min: number;
  actif: boolean;
  usages: number;
  limite: number;
  fin: string;
}

export interface Collection {
  id: string;
  titre: string;
  slug: string;
  on: boolean;
  desc: string;
  ids: string[];
}

export interface Article {
  id: string;
  titre: string;
  slug: string;
  statut: 'publie' | 'brouillon';
  date: string;
  extrait: string;
  image: string;
  contenu: string;
}

export interface Page {
  id: string;
  titre: string;
  slug: string;
  statut: 'publie' | 'brouillon';
  contenu: string;
}

export interface Media {
  src: string;
  name: string;
  builtin?: boolean;
}

export interface CartItem {
  id: string;
  qte: number;
}

export interface SiteSettings {
  siteName?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

export interface AdminUser {
  id: string;
  nom: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  actif: boolean;
  derniereVisite: string;
}

export interface AdminRole {
  id: string;
  label: string;
  permissions: string[];
}

/* ── Fidélité ── */

/** Bon d'achat généré par le programme de fidélité */
export interface Voucher {
  id: string;
  code: string;
  amount: number;           // Montant en € (10 par défaut)
  generatedAt: string;      // ISO date
  expiresAt: string;        // ISO date — 6 mois par défaut
  consumed: boolean;
  consumedAt?: string;
  orderId?: string;         // Commande qui a généré ce bon
  refunded: boolean;        // true si la commande d'origine a été remboursée
}

/** Solde fidélité d'un client */
export interface LoyaltyBalance {
  cumulativeSpend: number;  // Total TTC payé (hors frais de port)
  remainder: number;        // Solde restant après dernier palier
  vouchers: Voucher[];      // Bons générés
  nextThreshold: number;    // Prochain palier (100, 200, 300...)
}

/** Commande enregistrée */
export interface Order {
  id: string;
  date: string;
  client: string;
  email: string;
  adresse: string;
  livraison: string;
  paiement: string;
  total: number;
  subtotal: number;         // Montant articles hors frais de port
  articles: Array<{ nom: string; qty: number; prix: number }>; 
  statut: 'En attente' | 'Payée' | 'Expédiée' | 'Livrée' | 'Remboursée';
  voucherUsed?: string;     // ID du bon d'achat utilisé
}
