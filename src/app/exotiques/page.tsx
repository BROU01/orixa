import { getProducts, getCategories, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import type { Product } from '@/types';

export default async function ExotiquesPage() {
  const [products, categories, theme, menu] = await Promise.all([
    getProducts(),
    getCategories(),
    getTheme(),
    getMenu(),
  ]);

  const exoticProducts = products.filter((p: Product) => p.cat === 'exotic');

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <a href="/boutique">Boutique</a>
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

      <div className="wrap mb-6">
        <div className="cat-pills">
          <a href="/boutique" className="cat-pill">Tous</a>
          <a href="/cosmetiques" className="cat-pill">Cosmétiques</a>
          <a href="/exotiques" className="cat-pill" aria-current="page">Produits exotiques ({exoticProducts.length})</a>
          <a href="/nouveautes" className="cat-pill">Nouveautés</a>
        </div>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        <div className="prod-grid">
          {exoticProducts.map((product: Product) => (
            <div key={product.id} className="prod-card">
              <div className="prod-card__media">
                <img src={product.img} alt={product.nom} loading="lazy" />
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
      </div>

      <Footer theme={theme} />
    </div>
  );
}
