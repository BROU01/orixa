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
  /* ──────────── COSMÉTIQUES (EXISTANTS) ──────────── */
  { id: 'karite', nom: 'Beurre de karité pur', slug: 'beurre-de-karite', prix: 18.90, img: '/products/cosmetics/beurre-de-karite.jpg', cat: 'cosmetics', unite: 'Pot 200 ml', origine: 'Burkina Faso', stock: 45, badge: '', description: 'Beurre de karité 100% pur, issu de la coopérative de femmes de Koudougou. Hydratant intense pour peaux sèches et abîmées.' },
  { id: 'pommade', nom: 'Pommade au karité', slug: 'pommade-karite', prix: 12.50, img: '/products/cosmetics/pommade.jpg', cat: 'cosmetics', unite: 'Pot 100 ml', origine: 'Burkina Faso', stock: 34, badge: '', description: 'Pommade réparatrice au karité et huile de coco. Cicatrisante et protectrice.' },
  { id: 'blush', nom: 'Blush en poudre', slug: 'blush', prix: 9.50, img: '/products/cosmetics/blush.jpg', cat: 'cosmetics', unite: '1 compas', origine: 'France', stock: 28, badge: '', description: 'Blush en poudre pour un teint naturel et lumineux.' },
  { id: 'crayon-sourcils', nom: 'Crayon à sourcils blond', slug: 'crayon-sourcils-blond', prix: 7.90, img: '/products/cosmetics/crayon-a-sourcils-blond.jpg', cat: 'cosmetics', unite: '1 crayon', origine: 'France', stock: 22, badge: '', description: 'Crayon à sourcils pour un dessin précis et naturel.' },
  { id: 'faux-cils', nom: 'Faux cils', slug: 'faux-cils', prix: 6.50, img: '/products/cosmetics/faux-cils.jpg', cat: 'cosmetics', unite: '1 paire', origine: 'France', stock: 40, badge: '', description: 'Faux cils naturels pour un regard intense.' },
  { id: 'faux-ongles', nom: 'Faux ongles', slug: 'faux-ongles', prix: 5.90, img: '/products/cosmetics/faux-ongles.jpg', cat: 'cosmetics', unite: '1 kit', origine: 'France', stock: 35, badge: '', description: 'Kit de faux ongles élégants, facile à poser.' },
  { id: 'gel', nom: 'Gel coiffant', slug: 'gel', prix: 8.50, img: '/products/cosmetics/gel.jpg', cat: 'cosmetics', unite: 'Pot 250 ml', origine: 'France', stock: 30, badge: '', description: 'Gel coiffant pour un style durable et brillant.' },
  { id: 'mascara', nom: 'Mascara volume', slug: 'mascara', prix: 11.90, img: '/products/cosmetics/mascara.jpg', cat: 'cosmetics', unite: '1 tube', origine: 'France', stock: 25, badge: '', description: 'Mascara pour un volume spectaculaire et un regard profond.' },
  { id: 'masque-facial', nom: 'Masque facial au karité', slug: 'masque-facial', prix: 14.50, img: '/products/cosmetics/masque-facial.jpg', cat: 'cosmetics', unite: 'Pot 150 ml', origine: 'Burkina Faso', stock: 18, badge: '', description: 'Masque purifiant et nourrissant au beurre de karité.' },
  { id: 'parfum', nom: 'Parfum signature', slug: 'parfum', prix: 35.00, img: '/products/cosmetics/parfum.jpg', cat: 'cosmetics', unite: 'Flacon 50 ml', origine: 'France', stock: 12, badge: '', description: 'Parfum aux notes boisées et florales, signature de la maison.' },
  { id: 'rouge-levre', nom: 'Rouge à lèvres', slug: 'rouge-a-levre', prix: 8.90, img: '/products/cosmetics/rouge-a-levre.jpg', cat: 'cosmetics', unite: '1 bâton', origine: 'France', stock: 30, badge: '', description: 'Rouge à lèvres saturé et longue tenue.' },
  { id: 'vernis-ongles', nom: 'Vernis à ongles', slug: 'vernis-a-ongles', prix: 5.50, img: '/products/cosmetics/vernis-a-ongles.jpg', cat: 'cosmetics', unite: '1 flacon 10 ml', origine: 'France', stock: 38, badge: '', description: 'Vernis à ongles brillant, séchage rapide.' },

  /* ──────────── COSMÉTIQUES (NOUVEAUX) ──────────── */
  { id: 'cos-ct-plus', nom: 'Lotion clarifiante CT+', slug: 'lotion-ct-plus', prix: 14.90, img: '/products/cosmetics/ct-clear-lotion.jpg', cat: 'cosmetics', unite: 'Flacon 200 ml', origine: 'Nigeria', stock: 20, badge: 'Nouveau', description: 'Lotion clarifiante pour un teint uniforme et lumineux. Convient à tous les types de peau.' },
  { id: 'cos-carotone', nom: 'Lotion Carotone', slug: 'lotion-carotone', prix: 12.50, img: '/products/cosmetics/Carotone Lotion 350 ML.jpg', cat: 'cosmetics', unite: 'Flacon 350 ml', origine: 'Nigeria', stock: 25, badge: 'Nouveau', description: 'Lotion corporelle enrichie en carotte pour un teint doré et une peau douce.' },
  { id: 'cos-coco-pulp', nom: 'Lotion Coco Pulp', slug: 'lotion-coco-pulp', prix: 11.90, img: '/products/cosmetics/Coco pulp lotion.jpg', cat: 'cosmetics', unite: 'Flacon 250 ml', origine: 'Ghana', stock: 18, badge: 'Nouveau', description: 'Lotion hydratante à la pulpe de coco pour une peau nourrie et parfumée.' },
  { id: 'cos-disaar', nom: 'Vaseline Disaar Beauty Skincare', slug: 'vaseline-disaar', prix: 9.90, img: '/products/cosmetics/Disaar vaseline beauty skincare.png', cat: 'cosmetics', unite: 'Pot 200 ml', origine: 'Nigeria', stock: 30, badge: 'Nouveau', description: 'Vaseline beauté pour une peau douce, lisse et protégée au quotidien.' },
  { id: 'cos-jaune-oeuf', nom: 'Lotion Jaune d\'Oeuf', slug: 'lotion-jaune-oeuf', prix: 10.50, img: '/products/cosmetics/Juane D\'OEUF lotion.jpg', cat: 'cosmetics', unite: 'Flacon 250 ml', origine: 'Côte d\'Ivoire', stock: 22, badge: 'Nouveau', description: 'Lotion traditionnelle au jaune d\'oeuf pour fortifier et adoucir la peau.' },
  { id: 'cos-kojic', nom: 'Huile Kojic Acid Brightening', slug: 'huile-kojic-acid', prix: 16.90, img: '/products/cosmetics/huile-kojic-acid.jpg', cat: 'cosmetics', unite: 'Flacon 100 ml', origine: 'Japon', stock: 15, badge: 'Nouveau', description: 'Huile corporelle éclaircissante à l\'acide kojic et aux huiles essentielles. Hydrate et unifie le teint.' },
  { id: 'cos-mary-kay', nom: 'Blush en poudre Mary Kay', slug: 'blush-mary-kay', prix: 19.90, img: '/products/cosmetics/Mary Kay blush en poudre.jpg', cat: 'cosmetics', unite: '1 compas', origine: 'USA', stock: 12, badge: 'Nouveau', description: 'Blush en poudre Mary Kay pour un teint naturellement rosé et lumineux.' },
  { id: 'cos-paw-paw', nom: 'Lotion Paw Paw', slug: 'lotion-paw-paw', prix: 13.50, img: '/products/cosmetics/Paw Paw lotion.jpg', cat: 'cosmetics', unite: 'Flacon 250 ml', origine: 'Australie', stock: 20, badge: 'Nouveau', description: 'Lotion hydratante à l\'extrait de papaye pour une peau douce et repulpée.' },
  { id: 'cos-vaseline-b3', nom: 'Huile corporelle Vaseline Vitamin B3', slug: 'huile-vaseline-b3', prix: 11.90, img: '/products/cosmetics/vaseline-vitamin-b3.jpg', cat: 'cosmetics', unite: 'Flacon 200 ml', origine: 'USA', stock: 28, badge: 'Nouveau', description: 'Huile corporelle légère enrichie en vitamine B3 (niacinamide). Hydrate profondément et revitalise les peaux ternes.' },
  { id: 'cos-white-secret', nom: 'Lotion éclaircissante White Secret', slug: 'lotion-white-secret', prix: 15.90, img: '/products/cosmetics/White Secret Lightening Body Lotion.jpg', cat: 'cosmetics', unite: 'Flacon 400 ml', origine: 'Nigeria', stock: 22, badge: 'Nouveau', description: 'Lotion corporelle éclaircissante pour un teint uniforme et unifié. Texture légère et non grasse.' },
  { id: 'cos-whitening', nom: 'Crème éclaircissante corps', slug: 'creme-whitening', prix: 13.90, img: '/products/cosmetics/Whitening skin body.png', cat: 'cosmetics', unite: 'Pot 300 ml', origine: 'Nigeria', stock: 18, badge: 'Nouveau', description: 'Crème éclaircissante pour le corps, enrichie en actifs naturels pour un teint lumineux.' },
  { id: 'cos-vaseline-pack', nom: 'Pack Vaseline Collection', slug: 'pack-vaseline', prix: 24.90, img: '/products/cosmetics/vaseline all products.png', cat: 'cosmetics', unite: 'Coffret 3 pièces', origine: 'USA', stock: 10, badge: 'Nouveau', description: 'Coffret Vaseline avec trois soins essentiels pour une peau douce et hydratée au quotidien.' },

  /* ──────────── PRODUITS EXOTIQUES (EXISTANTS) ──────────── */
  { id: 'gari', nom: 'Gari précuit', slug: 'gari-precuit', prix: 4.50, img: '/products/exotic/gari.jpeg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Côte d\'Ivoire', stock: 120, badge: '', description: 'Gari précuit traditionnel, prêt à consommer. Accompagne vos plats et sauces.', labelImg: '/products/exotic/Gari Etiquette.jpeg' },
  { id: 'hibiscus', nom: 'Fleurs d\'hibiscus séchées', slug: 'hibiscus', prix: 6.80, img: '/products/exotic/hibiscus.jpg', cat: 'exotic', unite: 'Sac 150 g', origine: 'Sénégal', stock: 88, badge: '', description: 'Fleurs d\'hibiscus séchées pour tisanes et boissons. Riche en vitamines et antioxydants.', labelImg: '/products/exotic/Fleur d\'hibiscus (Bissap) Etiquette.jpeg' },
  { id: 'gombo-moulu', nom: 'Gombo moulu', slug: 'gombo-moulu', prix: 3.90, img: '/products/exotic/gombo-moulu.png', cat: 'exotic', unite: 'Sac 200 g', origine: 'Cameroun', stock: 67, badge: '', description: 'Gombo séché et moulu, idéal pour les sauces et ragoûts traditionnels.', labelImg: '/products/exotic/Gombo moulu etiquette.jpeg' },
  { id: 'aklui', nom: 'Aklui — Granulé de maïs fermenté', slug: 'aklui', prix: 4.20, img: '/products/exotic/aklui.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Ghana', stock: 55, badge: '', description: 'Granulé de maïs fermenté, base de porridge et pâte. Tradition ghanéenne.', labelImg: '/products/exotic/aklui Granulé de mais fementé  (Étiquette).jpeg' },
  { id: 'attieke', nom: 'Attiéké (Garba)', slug: 'attieke', prix: 5.50, img: '/products/exotic/attieke.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Côte d\'Ivoire', stock: 60, badge: '', description: 'Attiéké traditionnel, semoule de manioc fermentée. Accompagne poisson grillé et sauces.', labelImg: '/products/exotic/atieke (Garba) Etiquette.jpeg' },
  { id: 'aubergine-blanche', nom: 'Aubergine blanche séchée', slug: 'aubergine-blanche', prix: 3.80, img: '/products/exotic/aubergine-blanche.jpg', cat: 'exotic', unite: 'Sac 200 g', origine: 'Sénégal', stock: 40, badge: '', description: 'Aubergine blanche séchée, ingrédient essentiel des sauces ouest-africaines.' },
  { id: 'banane-plantain', nom: 'Banane plantain séchée', slug: 'banane-plantain', prix: 4.90, img: '/products/exotic/banane-plantain.jpg', cat: 'exotic', unite: 'Sac 300 g', origine: 'Cameroun', stock: 45, badge: '', description: 'Banane plantain séchée, prêt à frire ou à cuire. Snack naturel et nourrissant.' },
  { id: 'cossete-igname', nom: 'Cossette d\'igname séchée', slug: 'cossete-igname', prix: 5.20, img: '/products/exotic/cossete-igname.webp', cat: 'exotic', unite: 'Sac 250 g', origine: 'Bénin', stock: 35, badge: '', description: 'Cossette d\'igname séchée, alternative pratique à l\'igname fraîche. Idéale pour fufu et pâte.', labelImg: '/products/exotic/Cossette de manioc Etiquette.jpeg' },
  { id: 'farine-haricot', nom: 'Farine de haricot', slug: 'farine-haricot', prix: 4.80, img: '/products/exotic/farine-d-haricot.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Bénin', stock: 30, badge: '', description: 'Farine de haricot pour pâte et sauces. Source de protéines végétales.', labelImg: '/products/exotic/Farine de haricot (Étiquette).jpeg' },
  { id: 'gombo', nom: 'Gombo frais séché', slug: 'gombo-frais', prix: 3.50, img: '/products/exotic/gombo.jpg', cat: 'exotic', unite: 'Sac 150 g', origine: 'Cameroun', stock: 50, badge: '', description: 'Gombo frais séché, pour sauces et ragoûts. Texture mucilagineuse caractéristique.' },
  { id: 'igname', nom: 'Igname séchée', slug: 'igname', prix: 6.50, img: '/products/exotic/igname.jpg', cat: 'exotic', unite: 'Sac 300 g', origine: 'Bénin', stock: 40, badge: '', description: 'Igname séchée, féculent noble d\'Afrique de l\'Ouest. Base de fufu et pâte.' },
  { id: 'koms', nom: 'Koms (Kondre)', slug: 'koms', prix: 4.00, img: '/products/exotic/koms.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Guinée', stock: 35, badge: '', description: 'Koms, farine de banane plantain fermentée. Ingrédient de base pour le kondre.' },
  { id: 'manioc', nom: 'Manioc séché', slug: 'manioc', prix: 4.50, img: '/products/exotic/manioc.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Congo', stock: 55, badge: '', description: 'Manioc séché pour fufu et pâte. Féculent polyvalent et nourrissant.' },
  { id: 'piments', nom: 'Piments séchés', slug: 'piments', prix: 3.20, img: '/products/exotic/piments.jpg', cat: 'exotic', unite: 'Sac 100 g', origine: 'Côte d\'Ivoire', stock: 70, badge: '', description: 'Piments séchés et moulus pour relevés vos plats. Piquant authentique.' },
  { id: 'tapioca', nom: 'Tapioca', slug: 'tapioca', prix: 3.80, img: '/products/exotic/tapioca.jpeg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Brésil', stock: 45, badge: '', description: 'Perles de tapioca pour desserts, boissons et puddings. Texture crémeuse et saveur délicate.', labelImg: '/products/exotic/Tapioca Etiquette.jpeg' },

  /* ──────────── PRODUITS EXOTIQUES (NOUVEAUX) ──────────── */
  { id: 'exo-akpi', nom: 'Akpi', slug: 'akpi', prix: 5.90, img: '/products/exotic/Akpi.jpg', cat: 'exotic', unite: 'Sac 200 g', origine: 'Côte d\'Ivoire', stock: 25, badge: 'Nouveau', description: 'Graines d\'akpi pour sauces et condiments. Saveur unique et texture épaississante.', labelImg: '/products/exotic/Akpi etiquette.jpeg' },
  { id: 'exo-arachide', nom: 'Arachide fraîche', slug: 'arachide-fraiche', prix: 3.50, img: '/products/exotic/Arachide frais.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Sénégal', stock: 60, badge: 'Nouveau', description: 'Arachide fraîche décortiquée, pour collations et préparation de sauces.', labelImg: '/products/exotic/Arachide frais Etiquettte.jpeg' },
  { id: 'exo-clou-girofle', nom: 'Clou de girofle', slug: 'clou-girofle', prix: 6.50, img: '/products/exotic/Clou de girofle.jpg', cat: 'exotic', unite: 'Sac 100 g', origine: 'Madagascar', stock: 30, badge: 'Nouveau', description: 'Clous de girofle entiers pour épices et infusions. Arôme puissant et chaleureux.', labelImg: '/products/exotic/Clou de girofle Etiquette.jpeg' },
  { id: 'exo-farine-kom', nom: 'Farine de Kom banku', slug: 'farine-kom-banku', prix: 4.20, img: '/products/exotic/Farine de Kom banku.jpg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Ghana', stock: 35, badge: 'Nouveau', description: 'Farine de maïs fermentée pour préparer le banku, plat traditionnel ghanéen.', labelImg: '/products/exotic/Farine de Kom banku etiquette.jpeg' },
  { id: 'exo-farine-manioc', nom: 'Farine de manioc sans gluten', slug: 'farine-manioc', prix: 4.50, img: '/products/exotic/Farine de manioc sans glutten.jpeg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Congo', stock: 40, badge: 'Nouveau', description: 'Farine de manioc 100% sans gluten, pour pâtisseries et épaississement de sauces.', labelImg: '/products/exotic/Farine de manioc sans glutten Etiquette.jpeg' },
  { id: 'exo-farine-mil', nom: 'Farine de mil', slug: 'farine-mil', prix: 3.90, img: '/products/exotic/Farine de mil.jpeg', cat: 'exotic', unite: 'Sac 500 g', origine: 'Burkina Faso', stock: 30, badge: 'Nouveau', description: 'Farine de mil pour porridge et pâte. Céréale nutritive et energisante.', labelImg: '/products/exotic/Farine de mil Etiquette.jpeg' },
  { id: 'exo-moringa', nom: 'Feuilles de moringa', slug: 'feuilles-moringa', prix: 7.90, img: '/products/exotic/Feuilles de moringa.jpg', cat: 'exotic', unite: 'Sac 100 g', origine: 'Sénégal', stock: 25, badge: 'Nouveau', description: 'Feuilles de moringa séchées, super-aliment riche en nutriments. Pour tisanes et cuisines.', labelImg: '/products/exotic/Feuilles de moringa Etiquette.jpeg' },
  { id: 'exo-huile-palme', nom: 'Huile rouge de palme', slug: 'huile-rouge-palme', prix: 5.50, img: '/products/exotic/Huile rouge de palme.jpg', cat: 'exotic', unite: 'Flacon 500 ml', origine: 'Cameroun', stock: 20, badge: 'Nouveau', description: 'Huile rouge de palme vierge, pour sauces et plats traditionnels. Richesse nutritionnelle exceptionnelle.', labelImg: '/products/exotic/Huile rouge de palme Etiquette.jpeg' },
  { id: 'exo-pili-piment', nom: 'Pili-piment', slug: 'pili-piment', prix: 4.90, img: '/products/exotic/Pili_piment.jpg', cat: 'exotic', unite: 'Sac 150 g', origine: 'Côte d\'Ivoire', stock: 35, badge: 'Nouveau', description: 'Pili-piment séché et moulu, condiment épicé pour sauces et marinades.', labelImg: '/products/exotic/Pili_piment (Etiquette).jpeg' },
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
  /* ── Cosmétiques (existants) ── */
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
  /* ── Cosmétiques (nouveaux) ── */
  { src: '/products/cosmetics/ct-clear-lotion.jpg', name: 'ct-clear-lotion.jpg', builtin: true },
  { src: '/products/cosmetics/Carotone Lotion 350 ML.jpg', name: 'Carotone Lotion 350 ML.jpg', builtin: true },
  { src: '/products/cosmetics/Coco pulp lotion.jpg', name: 'Coco pulp lotion.jpg', builtin: true },
  { src: '/products/cosmetics/Disaar vaseline beauty skincare.png', name: 'Disaar vaseline beauty skincare.png', builtin: true },
  { src: '/products/cosmetics/Juane D\'OEUF lotion.jpg', name: "Juane D'OEUF lotion.jpg", builtin: true },
  { src: '/products/cosmetics/huile-kojic-acid.jpg', name: 'Kojic Acid Body Oil.jpg', builtin: true },
  { src: '/products/cosmetics/Mary Kay blush en poudre.jpg', name: 'Mary Kay blush en poudre.jpg', builtin: true },
  { src: '/products/cosmetics/Paw Paw lotion.jpg', name: 'Paw Paw lotion.jpg', builtin: true },
  { src: '/products/cosmetics/vaseline-vitamin-b3.jpg', name: 'Vaseline Vitamin B3 Body Oil.jpg', builtin: true },
  { src: '/products/cosmetics/White Secret Lightening Body Lotion.jpg', name: 'White Secret Lightening Body Lotion.jpg', builtin: true },
  { src: '/products/cosmetics/Whitening skin body.png', name: 'Whitening skin body.png', builtin: true },
  { src: '/products/cosmetics/vaseline all products.png', name: 'vaseline all products.png', builtin: true },
  /* ── Produits exotiques (existants) ── */
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
  /* ── Produits exotiques (nouveaux) ── */
  { src: '/products/exotic/Akpi.jpg', name: 'Akpi.jpg', builtin: true },
  { src: '/products/exotic/Arachide frais.jpg', name: 'Arachide frais.jpg', builtin: true },
  { src: '/products/exotic/Clou de girofle.jpg', name: 'Clou de girofle.jpg', builtin: true },
  { src: '/products/exotic/Farine de Kom banku.jpg', name: 'Farine de Kom banku.jpg', builtin: true },
  { src: '/products/exotic/Farine de manioc sans glutten.jpeg', name: 'Farine de manioc sans gluten.jpeg', builtin: true },
  { src: '/products/exotic/Farine de mil.jpeg', name: 'Farine de mil.jpeg', builtin: true },
  { src: '/products/exotic/Feuilles de moringa.jpg', name: 'Feuilles de moringa.jpg', builtin: true },
  { src: '/products/exotic/Huile rouge de palme.jpg', name: 'Huile rouge de palme.jpg', builtin: true },
  { src: '/products/exotic/Pili_piment.jpg', name: 'Pili_piment.jpg', builtin: true },
  /* ── Étiquettes (nouvelles) ── */
  { src: '/products/exotic/Akpi etiquette.jpeg', name: 'Akpi etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Arachide frais Etiquettte.jpeg', name: 'Arachide frais Etiquettte.jpeg', builtin: true },
  { src: '/products/exotic/Beure de karité Etiquette.jpeg', name: 'Beure de karité Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Clou de girofle Etiquette.jpeg', name: 'Clou de girofle Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Cossette de manioc Etiquette.jpeg', name: 'Cossette de manioc Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Farine de Kom banku etiquette.jpeg', name: 'Farine de Kom banku etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Farine de haricot (Étiquette).jpeg', name: 'Farine de haricot (Etiquette).jpeg', builtin: true },
  { src: '/products/exotic/Farine de manioc sans glutten Etiquette.jpeg', name: 'Farine de manioc sans glutten Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Farine de mil Etiquette.jpeg', name: 'Farine de mil Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Feuilles de moringa Etiquette.jpeg', name: 'Feuilles de moringa Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Fleur d\'hibiscus (Bissap) Etiquette.jpeg', name: "Fleur d'hibiscus (Bissap) Etiquette.jpeg", builtin: true },
  { src: '/products/exotic/Gari Etiquette.jpeg', name: 'Gari Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Gombo moulu etiquette.jpeg', name: 'Gombo moulu etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Huile rouge de palme Etiquette.jpeg', name: 'Huile rouge de palme Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/Pili_piment (Etiquette).jpeg', name: 'Pili_piment (Etiquette).jpeg', builtin: true },
  { src: '/products/exotic/Tapioca Etiquette.jpeg', name: 'Tapioca Etiquette.jpeg', builtin: true },
  { src: '/products/exotic/aklui Granulé de mais fementé  (Étiquette).jpeg', name: 'aklui Granulé de mais fermenté (Etiquette).jpeg', builtin: true },
  { src: '/products/exotic/atieke (Garba) Etiquette.jpeg', name: 'atieke (Garba) Etiquette.jpeg', builtin: true },
];

const DEFAULT_USERS: AdminUser[] = [
  { id: 'u-1', nom: 'Kalipé G.', email: 'maroquinerie.lagrace@gmail.com', role: 'owner', actif: true, derniereVisite: '2026-08-19' },
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
    // Si la valeur stockée est un tableau vide, utiliser le fallback
    const val = data.value as T;
    if (Array.isArray(val) && val.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return val;
  } catch {
    return fallback;
  }
}

export async function getProducts(): Promise<Product[]> {
  const stored = await fetchCms<Product[]>('orixa:products', []);
  // Si Supabase a des produits, fusionner avec les DEFAULT_PRODUCTS
  // en dédoublonnant par nom pour éviter les doublons
  if (stored.length > 0) {
    const seen = new Set<string>();
    const merged: Product[] = [];
    // D'abord les produits Supabase
    for (const p of stored) {
      const key = p.nom.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(p);
      }
    }
    // Puis les DEFAULT_PRODUCTS manquants (par nom)
    for (const p of DEFAULT_PRODUCTS) {
      const key = p.nom.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(p);
      }
    }
    return merged;
  }
  return DEFAULT_PRODUCTS;
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
  const stored = await fetchCms<Media[]>('orixa:media', []);
  if (stored.length > 0) {
    const storedSrcs = new Set(stored.map(m => m.src));
    const missing = DEFAULT_MEDIA.filter(m => !storedSrcs.has(m.src));
    return [...stored, ...missing];
  }
  return DEFAULT_MEDIA;
}

export async function getUsers(): Promise<AdminUser[]> {
  return fetchCms('orixa:users', DEFAULT_USERS);
}

export async function getRoles(): Promise<AdminRole[]> {
  return fetchCms('orixa:roles', DEFAULT_ROLES);
}
