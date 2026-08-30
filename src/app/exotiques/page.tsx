import Image from 'next/image';
import { getProducts, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produits exotiques — Gari, hibiscus, gombo, igname',
  description:
    'Ingrédients et épices d\'Afrique de l\'Ouest : gari précuit, fleurs d\'hibiscus, gombo moulu, igname et épices de terroir. Arrivage direct producteurs, livraison Europe.',
  keywords: [
    'produits exotiques', 'gari', 'gari précuit', 'hibiscus', 'fleurs hibiscus',
    'gombo', 'gombo moulu', 'igname', 'épices africaines', 'épices terroir',
    'produits Afrique', 'boutique africaine', 'MAISON LA GRACE', 'cuisine africaine',
  ],
  openGraph: {
    title: 'Produits exotiques — MAISON LA GRACE',
    description:
      'Gari, hibiscus, gombo, igname et épices. Ingrédients authentiques en arrivage direct.',
    url: 'https://maisonlagrace.fr/exotiques',
    siteName: 'MAISON LA GRACE',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: { canonical: 'https://maisonlagrace.fr/exotiques' },
};

export default async function ExotiquesPage() {
  const [products, theme, menu] = await Promise.all([
    getProducts(),
    getTheme(),
    getMenu(),
  ]);

  const exoticProducts = products.filter((p: Product) => p.cat === 'exotiques' || p.cat === 'exotic');

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Produits exotiques</span>
        </nav>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0 }}>
        <span className="eyebrow">Saveurs & Épicerie Fine</span>
        <h1 className="h-display h1" style={{ marginTop: '8px' }}>Ingrédients & Produits Exotiques</h1>
        <p className="lede" style={{ marginTop: '8px' }}>
          Gari, hibiscus, gombo, igname et épices de terroir en arrivage direct des producteurs.
        </p>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        {exoticProducts.length === 0 ? (
          <div className="empty">
            <h2 className="empty__title">Aucun produit exotique pour le moment</h2>
            <p className="empty__text">Nous préparons de nouvelles arrivées. Revenez bientôt ou découvrez l&apos;ensemble du catalogue.</p>
            <a href="/cosmetiques" className="btn btn--primary">
              Voir les cosmétiques
            </a>
          </div>
        ) : (
          <div className="prod-grid">
            {exoticProducts.map((product: Product) => (
              <div key={product.id} className="prod-card">
                <div className="prod-card__media">
                  <Image src={product.img} alt={product.nom} fill sizes="(max-width: 640px) 50vw, 280px" style={{ objectFit: 'cover' }} />
                  {product.labelImg && <Image src={product.labelImg} alt={`${product.nom} étiquette`} className="prod-card__label" fill sizes="(max-width: 640px) 50vw, 280px" style={{ objectFit: 'cover' }} />}
                  {product.badge && (
                    <span className={`prod-card__badge badge ${product.badge === 'Nouveau' ? 'badge--new' : 'badge--promo'}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="prod-card__body">
                  <span className="origine">{product.origine}</span>
                  <h3 className="prod-card__name">
                    <a href={`/produit/${product.slug}`}>{product.nom}</a>
                  </h3>
                  <p className="prod-card__meta">{product.unite}</p>
                  <div className="prod-card__foot">
                    <PriceTag amount={product.prix} className="prod-card__price" />
                    <a href={`/produit/${product.slug}`} className="btn btn--primary btn--sm">
                      Découvrir
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer theme={theme} />
    </div>
  );
}
