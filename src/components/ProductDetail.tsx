'use client';

import { useEffect, useState } from 'react';
import type { MenuItem, Product, Theme } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';

interface ProductDetailProps {
  product: Product;
  menu: MenuItem[];
  theme: Theme;
}

export default function ProductDetail({ product, menu, theme }: ProductDetailProps) {
  const [qte, setQte] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem('orixa:favs');
      if (storedFavs) {
        const favs = JSON.parse(storedFavs);
        if (Array.isArray(favs) && favs.some((f: { id: string }) => f.id === product.id)) {
          setIsFav(true);
        }
      }
    } catch { /* ignore */ }
  }, [product.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = () => {
    try {
      const stored = localStorage.getItem('orixa:cart');
      const cart = stored ? JSON.parse(stored) : [];
      const existing = cart.find((item: { id: string }) => item.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || existing.qte || 1) + qte;
      } else {
        cart.push({
          id: product.id,
          nom: product.nom,
          prix: product.prix,
          img: product.img,
          qty: qte,
        });
      }
      localStorage.setItem('orixa:cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('orixa:cart-updated'));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch { /* ignore */ }
  };

  const toggleFavorite = () => {
    try {
      const stored = localStorage.getItem('orixa:favs');
      let favs = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(favs)) favs = [];

      const exists = favs.some((f: { id: string }) => f.id === product.id);
      if (exists) {
        favs = favs.filter((f: { id: string }) => f.id !== product.id);
        setIsFav(false);
      } else {
        favs.push({
          id: product.id,
          nom: product.nom,
          prix: product.prix,
          img: product.img,
          origine: product.origine,
          unite: product.unite,
        });
        setIsFav(true);
      }
      localStorage.setItem('orixa:favs', JSON.stringify(favs));
      window.dispatchEvent(new Event('orixa:favs-updated'));
    } catch { /* ignore */ }
  };

  const isCosmetic = product.cat === 'cosmetics' || product.cat === 'cosmetiques';

  const slides = [
    <div key="photo" className="pdp__slide">
      <img src={product.img} alt={product.nom} />
    </div>,
    <div key="sticker" className="pdp__slide pdp__slide--sticker">
      <img src={product.img} alt="" aria-hidden="true" />
      <div className="pdp__slide-overlay">
        <div className="pdp__sticker">
          {product.badge || 'Sélection MAISON LA GRACE'}
        </div>
      </div>
    </div>,
    <div key="combo" className="pdp__slide pdp__slide--combo">
      <img src={product.img} alt="" aria-hidden="true" />
      <div className="pdp__slide-gradient" />
      <div className="pdp__slide-caption">
        <p>{product.nom}</p>
        <span>{product.origine}</span>
        <PriceTag amount={product.prix} />
      </div>
    </div>,
  ];

  return (
    <div className="product-page" style={{ background: theme.paper, color: theme.text }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb" aria-label="Fil d’Ariane">
          <a href="/">Accueil</a>
          <span>/</span>
          <a href={`/${isCosmetic ? 'cosmetiques' : 'exotiques'}`}>
            {isCosmetic ? 'Cosmétiques' : 'Produits exotiques'}
          </a>
          <span>/</span>
          <span aria-current="page">{product.nom}</span>
        </nav>
      </div>

      <main className="wrap section--tight product-page__main">
        <div className="pdp">
          <div className="pdp__gallery">
            <div className="pdp__media">
              {slides[slideIndex]}
            </div>
            <div className="pdp__indicators" aria-label="Galerie produit">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={i === slideIndex ? 'pdp__indicator pdp__indicator--active' : 'pdp__indicator'}
                  aria-label={`Aller au visuel ${i + 1}`}
                  aria-current={i === slideIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>

          <div className="pdp__details">
            <span className="eyebrow">{product.origine} · {product.unite}</span>
            <h1 className="h-display h1 pdp__title">{product.nom}</h1>

            <div className="pdp__summary">
              <PriceTag amount={product.prix} className="pdp__price" />
              <span className={product.stock > 0 ? 'pdp__stock' : 'pdp__stock pdp__stock--empty'}>
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>

            <p className="pdp__desc">
              {product.description || 'Produit d\'exception d\'origine naturelle certifiée. Sélectionné avec exigence par la Maison MAISON LA GRACE.'}
            </p>

            <div className="pdp__loyalty">
              <span className="pdp__loyalty-icon" aria-hidden="true">♥</span>
              <div>
                <p className="pdp__loyalty-title">Programme fidélité MAISON LA GRACE</p>
                <p>Cet achat vous rapporte <strong>{product.prix.toFixed(2)} €</strong> de fidélité (100 € cumulés = bon de 10 €).</p>
              </div>
            </div>

            <div className="pdp__purchase">
              <div className="pdp__quantity-row">
                <label htmlFor="product-quantity">Quantité</label>
                <div className="qty">
                  <button type="button" onClick={() => setQte(Math.max(1, qte - 1))} aria-label="Diminuer la quantité">−</button>
                  <input id="product-quantity" type="number" min="1" max={Math.max(1, product.stock)} value={qte} onChange={(event) => setQte(Math.max(1, Math.min(product.stock || 1, Number(event.target.value) || 1)))} aria-label="Quantité" />
                  <button type="button" onClick={() => setQte(Math.min(product.stock || 1, qte + 1))} aria-label="Augmenter la quantité">+</button>
                </div>
              </div>

              <div className="pdp__actions">
                <button type="button" onClick={addToCart} disabled={product.stock <= 0} className="btn btn--primary btn--lg">
                  {addedToCart ? 'Ajouté au panier' : 'Ajouter au panier'}
                </button>
                <button type="button" onClick={toggleFavorite} className={isFav ? 'btn btn--secondary btn--lg pdp__favorite pdp__favorite--active' : 'btn btn--secondary btn--lg pdp__favorite'}>
                  {isFav ? '♥ Dans les favoris' : '♡ Ajouter aux favoris'}
                </button>
              </div>
            </div>

            <div className="pdp__shipping">
              <p className="pdp__shipping-title">Livraison & retours</p>
              <p>Livraison en 3 à 5 jours. Livraison offerte dès 80 € d&apos;achat.</p>
              {product.cat === 'exotiques' || product.cat === 'exotic' ? (
                <p className="pdp__shipping-warning">Denrée périssable : non reprise ni échange conformément à la réglementation en vigueur.</p>
              ) : (
                <p>Retour possible sous 14 jours si le produit est non ouvert et dans son emballage d&apos;origine.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
