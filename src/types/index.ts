/**
 * ORIXA — Types TypeScript
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
