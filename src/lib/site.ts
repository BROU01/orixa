/**
 * URL canonique du site — source unique de vérité pour le sitemap, robots.txt
 * et les métadonnées, afin d'éviter toute divergence entre ces fichiers.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://maisonlagrace.fr').replace(/\/$/, '');
