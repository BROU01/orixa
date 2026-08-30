import Image from 'next/image';
import { getProducts, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import type { Product } from '@/types';

export const metadata = {
  title: 'Nouveautés — Dernières arrivées MAISON LA GRACE',
  description:
    'Découvrez les dernières nouveautés MAISON LA GRACE : cosmétiques naturels et produits exotiques fraîchement arrivés de nos coopératives africaines.',
  keywords: ['nouveautés MAISON LA GRACE', 'nouveaux produits', 'dernières arrivées', 'cosmétiques neufs', 'exotiques'],
};

export default async function NouveautesPage() {
  const [products, theme, menu] = await Promise.all([
    getProducts(),
    getTheme(),
    getMenu(),
  ]);

  const newProducts = products.filter((p: Product) => p.badge === 'Nouveau');

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Nouveautés</span>
        </nav>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0 }}>
        <span className="eyebrow">Dernières Arrivées</span>
        <h1 className="h-display h1" style={{ marginTop: '8px' }}>Nouveautés de la Saison</h1>
        <p className="lede" style={{ marginTop: '8px' }}>
          Explorez les tout derniers arrivages de notre coopérative éco-responsable.
        </p>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        {newProducts.length === 0 ? (
          <div className="empty">
            <h2 className="empty__title">Aucune nouveauté pour le moment</h2>
            <p className="empty__text">De nouveaux produits arrivent bientôt. Revenez bientôt ou découvrez l&apos;ensemble du catalogue.</p>
            <a href="/cosmetiques" className="btn btn--primary">
              Parcourir nos produits
            </a>
          </div>
        ) : (
          <div className="prod-grid">
            {newProducts.map((product: Product) => (
              <div key={product.id} className="prod-card">
                <div className="prod-card__media">
                  <Image src={product.img} alt={product.nom} fill sizes="(max-width: 640px) 50vw, 280px" style={{ objectFit: 'cover' }} />
                  {product.labelImg && <Image src={product.labelImg} alt={`${product.nom} étiquette`} className="prod-card__label" fill sizes="(max-width: 640px) 50vw, 280px" style={{ objectFit: 'cover' }} />}
                  <span className="prod-card__badge badge badge--new">
                    Nouveau
                  </span>
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
