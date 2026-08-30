import Image from 'next/image';
import { getProducts, getCategories, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import type { Product, Category } from '@/types';

/**
 * Page boutique ORIXA — Catalogue complet avec filtres et grilles originelles.
 */
export default async function BoutiquePage() {
  const [products, categories, theme, menu] = await Promise.all([
    getProducts(),
    getCategories(),
    getTheme(),
    getMenu(),
  ]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      {/* Fil d'Ariane Original */}
      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Boutique</span>
        </nav>
      </div>

      {/* En-tête de section */}
      <div className="wrap section--tight" style={{ paddingTop: 0 }}>
        <span className="eyebrow">Catalogue complet</span>
        <h1 className="h-display h1" style={{ marginTop: '8px' }}>La Boutique</h1>
        <p className="lede" style={{ marginTop: '8px' }}>
          Tous nos cosmétiques bruts et trésors d&apos;épicerie fine d&apos;Afrique de l&apos;Ouest et d&apos;ailleurs.
        </p>
      </div>

      {/* Catégories Pills */}
      <div className="wrap mb-6">
        <div className="cat-pills">
          <a href="/boutique" className="cat-pill" aria-current="page">Tous ({products.length})</a>
          {categories.map((cat: Category) => (
            <a key={cat.id} href={`/${cat.slug}`} className="cat-pill">
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Grille des produits */}
      <div className="wrap section--tight" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        <div className="prod-grid">
          {products.map((product: Product) => (
            <div key={product.id} className="prod-card">
              <div className="prod-card__media">
                <Image src={product.img} alt={product.nom} fill sizes="(max-width: 640px) 50vw, 280px" style={{ objectFit: 'cover' }} />
                {product.badge && (
                  <span className={`prod-card__badge badge ${product.badge === 'Nouveau' ? 'badge--new' : 'badge--promo'}`}>
                    {product.badge}
                  </span>
                )}
                {product.stock <= 0 && (
                  <span className="prod-card__badge badge badge--rupture" style={{ right: '8px', left: 'auto' }}>
                    Rupture
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
      </div>

      <Footer theme={theme} />
    </div>
  );
}
