import { getProducts, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cosmétiques naturels — Beurre de karité, soins bio',
  description:
    'Découvrez nos cosmétiques naturels : beurre de karité pur, pommade réparatrice, huiles végétales et soins capillaires biologiques. Ingrédients 100 % purs, livraison Europe.',
  keywords: [
    'cosmétiques naturels', 'beurre de karité', 'karité pur', 'pommade karité',
    'soins bio peau', 'huile végétale', 'soins capillaires', 'cosmétiques bio',
    'produits naturels', 'MAISON LA GRACE', 'coiffe karité', 'beurre karité brut',
  ],
  openGraph: {
    title: 'Cosmétiques naturels — MAISON LA GRACE',
    description:
      'Beurre de karité, pommade réparatrice, huiles végétales. Soins naturels sélectionnés en Afrique de l\'Ouest.',
  },
};

export default async function CosmetiquesPage() {
  const [products, theme, menu] = await Promise.all([
    getProducts(),
    getTheme(),
    getMenu(),
  ]);

  const EXCLUDED_IDS = ['p1786996224386'];
  const cosmeticsProducts = products.filter((p: Product) =>
    (p.cat === 'cosmetiques' || p.cat === 'cosmetics') && !EXCLUDED_IDS.includes(p.id)
  );

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Cosmétiques</span>
        </nav>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0 }}>
        <span className="eyebrow">Soins & Beauté Naturelle</span>
        <h1 className="h-display h1" style={{ marginTop: '8px' }}>Cosmétiques Authentiques</h1>
        <p className="lede" style={{ marginTop: '8px' }}>
          Beurres bruts, huiles végétales et soins capillaires biologiques sélectionnés en Afrique de l&apos;Ouest.
        </p>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        {cosmeticsProducts.length === 0 ? (
          <div className="empty">
            <h2 className="empty__title">Aucun produit cosmétique pour le moment</h2>
            <p className="empty__text">Nous préparons de nouvelles arrivées. Revenez bientôt ou découvrez l&apos;ensemble du catalogue.</p>
            <a href="/exotiques" className="btn btn--primary">
              Voir les produits exotiques
            </a>
          </div>
        ) : (
          <div className="prod-grid">
            {cosmeticsProducts.map((product: Product) => (
              <div key={product.id} className="prod-card">
                <div className="prod-card__media">
                  <a href={`/produit?id=${product.id}`} aria-label={product.nom}>
                    <img src={product.img} alt={product.nom} loading="lazy" />
                  </a>
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
                  {/* Pas de prod-card__meta (unite) pour les cosmétiques */}
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
        )}
      </div>

      <Footer theme={theme} />
    </div>
  );
}
