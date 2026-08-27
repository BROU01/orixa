import { getProducts, getCategories, getTheme, getSections, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import ScrollRevealObserver from '@/components/ScrollRevealObserver';
import type { Product, Category, Section } from '@/types';

/**
 * Landing Page MAISON LA GRACE — Port Next.js fidèle à 100% au design original.
 * Structure HTML & classes CSS de l'ancien frontend + animations Parallaxe et Scroll Reveal.
 */
export const metadata = {
  title: 'MAISON LA GRACE — Cosmétiques naturels & produits exotiques d\'Afrique',
  description:
    'Découvrez MAISON LA GRACE : cosmétiques naturels (beurre de karité, pommade, huiles) et produits exotiques (gari, hibiscus, gombo) d\'Afrique de l\'Ouest. Livraison offerte dès 80 € en Europe.',
  keywords: [
    'MAISON LA GRACE', 'cosmétiques naturels', 'produits exotiques', 'beurre de karité',
    'gari', 'hibiscus', 'gombo', 'produits Afrique', 'boutique bio Europe',
  ],
  openGraph: {
    title: 'MAISON LA GRACE — Cosmétiques naturels & produits exotiques',
    description:
      'Beurre de karité, hibiscus, gari, gombo. Cosmétiques et ingrédients d\'Afrique de l\'Ouest, livrés en Europe.',
    url: 'https://maisonlagrace.fr',
    siteName: 'MAISON LA GRACE',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: { canonical: 'https://maisonlagrace.fr' },
};

export default async function HomePage() {
  const [products, categories, theme, sections, menu] = await Promise.all([
    getProducts(),
    getCategories(),
    getTheme(),
    getSections(),
    getMenu(),
  ]);

  const heroSection = sections.find((s: Section) => s.type === 'hero');

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <ScrollRevealObserver />
      <Header menu={menu} theme={theme} />

      {/* Hero Section originale (100svh + Video + Parallax) */}
      <section className="hero hero-parallax-wrapper">
        <div className="hero__media">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/img/hero-poster.jpg"
            className="hero-video-bg"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero__inner hero-content reveal active">
          <span className="eyebrow">
            Maison Française · Produits d'Excellence
          </span>
          <h1 className="h-display hero__title">
            {heroSection?.title || 'MAISON LA GRACE'}
          </h1>
          <p className="hero__text">
            {heroSection?.subtitle || 'L\'alliance précieuse des soins naturels et des trésors exotiques authentiques.'}
          </p>
          <div className="hero__cta">
            <a href="/cosmetiques" className="btn btn--light">
              Découvrir nos cosmétiques
            </a>
            <a href="/histoire" className="btn btn--outline-light">
              Notre histoire
            </a>
          </div>
        </div>
      </section>

      {/* Engagements & Valeurs Bar */}
      <div className="announce" style={{ background: 'var(--ink-2)', color: 'var(--paper-2)', paddingBlock: '16px' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', textAlign: 'center' }}>
          <div className="reveal reveal-delay-1">
            <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Ingrédients 100% Purs</span>
            <p style={{ fontSize: '11px', textTransform: 'none', letterSpacing: '0', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              Coopératives éco-responsables du Burkina Faso, Sénégal & Côte d'Ivoire
            </p>
          </div>
          <div className="reveal reveal-delay-2">
            <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Savoir-Faire Artisanal</span>
            <p style={{ fontSize: '11px', textTransform: 'none', letterSpacing: '0', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              Formulations pures préservant les vertus naturelles originelles
            </p>
          </div>
          <div className="reveal reveal-delay-3">
            <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Expédition Europe</span>
            <p style={{ fontSize: '11px', textTransform: 'none', letterSpacing: '0', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              Livraison offerte dès 80 € avec suivi Colissimo & Mondial Relay
            </p>
          </div>
        </div>
      </div>

      {/* Produits Vedettes Section (Grille bordée originale) */}
      <section className="section wrap">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">Sélection d'exception</span>
            <h2 className="h-display h2">Nos produits phares</h2>
          </div>
          <div className="sec-head__links" aria-label="Catégories de produits">
            <a href="/cosmetiques" className="sec-head__link">Cosmétiques →</a>
            <a href="/exotiques" className="sec-head__link">Exotiques →</a>
          </div>
        </div>

        <div className="prod-grid">
          {products.slice(0, 6).map((product: Product, idx: number) => (
            <div
              key={product.id}
              className={`prod-card reveal reveal-delay-${(idx % 3) + 1}`}
            >
              <div className="prod-card__media">
                <img
                  src={product.img}
                  alt={product.nom}
                  loading="lazy"
                />
                {product.labelImg && <img src={product.labelImg} alt={`${product.nom} étiquette`} className="prod-card__label" loading="lazy" />}
                {product.badge && (
                  <span className={`prod-card__badge badge ${product.badge === 'Nouveau' ? 'badge--new' : 'badge--promo'}`}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="prod-card__body">
                <span className="origine">{product.origine}</span>
                <h3 className="prod-card__name">
                  <a href={`/produit?id=${product.id}`}>{product.nom}</a>
                </h3>
                <p className="prod-card__meta">{product.unite}</p>
                <div className="prod-card__foot">
                  <PriceTag amount={product.prix} className="prod-card__price" />
                  <a href={`/produit?id=${product.id}`} className="btn btn--primary btn--sm">
                    Découvrir
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grille des Rayons (Catégories) */}
      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">Parcourir par univers</span>
            <h2 className="h-display h2">Nos Rayons Exclusifs</h2>
          </div>
        </div>

        <div className="cat-grid">
          {categories.map((cat: Category, idx: number) => (
            <a
              key={cat.id}
              href={`/${cat.slug}`}
              className={`cat-card reveal reveal-delay-${idx + 1}`}
            >
              <div>
                <h3 className="cat-card__label">{cat.label}</h3>
                <p className="cat-card__desc">
                  {cat.desc || 'Découvrez notre gamme sélectionnée avec soin.'}
                </p>
              </div>
              <span className="cat-card__count">Découvrir le rayon →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Section Histoire Éditoriale */}
      <section className="section" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap reveal" style={{ maxWidth: '720px', marginInline: 'auto', textAlign: 'center' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>Philosophie MAISON LA GRACE</span>
          <h2 className="h-display h2" style={{ marginBottom: '20px' }}>
            Une Histoire de Passion & d'Authenticité
          </h2>
          <p className="lede" style={{ marginInline: 'auto', marginBottom: '32px' }}>
            Imaginée en France et nourrie par une tradition familiale, la maison MAISON LA GRACE sélectionne directement auprès des producteurs locaux les matières brutes les plus nobles.
          </p>
          <a href="/histoire" className="btn btn--primary">
            En savoir plus sur la Maison
          </a>
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
}
