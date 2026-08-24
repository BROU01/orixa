'use client';

import { useState, useEffect } from 'react';
import type { Product, MenuItem, Theme } from '@/types';
import { getMenu, getTheme } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';

export default function FavorisPage() {
  const [favs, setFavs] = useState<Product[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([getMenu(), getTheme()]).then(([m, t]) => {
      setMenu(m);
      setTheme(t);
    });

    try {
      const stored = localStorage.getItem('orixa:favs');
      if (stored) {
        setFavs(JSON.parse(stored));
      }
    } catch { /* ignore */ }
  }, []);

  const removeFav = (id: string) => {
    const updated = favs.filter((f) => f.id !== id);
    setFavs(updated);
    try {
      localStorage.setItem('orixa:favs', JSON.stringify(updated));
      window.dispatchEvent(new Event('orixa:favs-updated'));
    } catch { /* ignore */ }
  };

  const addToCart = (product: Product) => {
    try {
      const stored = localStorage.getItem('orixa:cart');
      const cart = stored ? JSON.parse(stored) : [];
      const existing = cart.find((item: { id: string }) => item.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          nom: product.nom,
          prix: product.prix,
          img: product.img,
          qty: 1,
        });
      }
      localStorage.setItem('orixa:cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('orixa:cart-updated'));
      removeFav(product.id);
    } catch { /* ignore */ }
  };

  if (!mounted) return null;

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme || undefined} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Mes Favoris</span>
        </nav>
      </div>

      <main className="wrap section--tight" style={{ paddingBottom: '96px' }}>
        <span className="eyebrow">Mes envies</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Mes Produits Favoris ({favs.length})
        </h1>

        {favs.length === 0 ? (
          <div className="empty">
            <h2 className="empty__title">Aucun produit favori</h2>
            <p className="empty__text">Parcourez le catalogue et cliquez sur le cœur ♡ pour ajouter des articles à vos coups de cœur.</p>

            <a href="/cosmetiques" className="btn btn--primary">
              Découvrir nos cosmétiques
            </a>
          </div>
        ) : (
          <div className="prod-grid">
            {favs.map((product) => (
              <div key={product.id} className="prod-card">
                <div className="prod-card__media">
                  <img src={product.img} alt={product.nom} loading="lazy" />
                  {product.labelImg && <img src={product.labelImg} alt={`${product.nom} étiquette`} className="prod-card__label" loading="lazy" />}
                  <button
                    type="button"
                    onClick={() => removeFav(product.id)}
                    className="prod-card__fav"
                    aria-pressed="true"
                    title="Retirer des favoris"
                    style={{ opacity: 1 }}
                  >
                    ♥
                  </button>
                </div>
                <div className="prod-card__body">
                  <span className="origine">{product.origine}</span>
                  <h3 className="prod-card__name">
                    <a href={`/produit?id=${product.id}`}>{product.nom}</a>
                  </h3>
                  <p className="prod-card__meta">{product.unite}</p>
                  <div className="prod-card__foot">
                    <PriceTag amount={product.prix} className="prod-card__price" />
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="btn btn--primary btn--sm"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer theme={theme || undefined} />
    </div>
  );
}
