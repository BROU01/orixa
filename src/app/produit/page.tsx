'use client';

import { useState, useEffect } from 'react';
import type { Product, MenuItem, Theme } from '@/types';
import { getProducts, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';

/**
 * Page produit détaillée ORIXA:
 * - Diapo automatique 2s (photo seule -> auto-collant badge -> combo photo + prix)
 * - Indicateurs cliquables
 * - Synchronisation directe du panier & favoris (dispatchEvent)
 * - Mention d'hygiène denrées périssables & points de fidélité
 */
export default function ProduitPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [qte, setQte] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    Promise.all([getProducts(), getMenu(), getTheme()]).then(([products, m, t]) => {
      setMenu(m);
      setTheme(t);
      if (id) {
        const found = products.find((p: Product) => p.id === id);
        setProduct(found || null);

        // Verify if in favorites
        try {
          const storedFavs = localStorage.getItem('orixa:favs');
          if (storedFavs) {
            const favs = JSON.parse(storedFavs);
            if (Array.isArray(favs) && favs.some((f: { id: string }) => f.id === id)) {
              setIsFav(true);
            }
          }
        } catch { /* ignore */ }
      }
    });
  }, []);

  // Diapo automatique 2s
  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, [product]);

  const addToCart = () => {
    if (!product) return;
    try {
      const stored = localStorage.getItem('orixa:cart');
      const cart = stored ? JSON.parse(stored) : [];
      const existing = cart.find((item: { id: string }) => item.id === product!.id);
      if (existing) {
        existing.qty = (existing.qty || existing.qte || 1) + qte;
      } else {
        cart.push({
          id: product!.id,
          nom: product!.nom,
          prix: product!.prix,
          img: product!.img,
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
    if (!product) return;
    try {
      const stored = localStorage.getItem('orixa:favs');
      let favs = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(favs)) favs = [];

      const exists = favs.some((f: { id: string }) => f.id === product!.id);
      if (exists) {
        favs = favs.filter((f: { id: string }) => f.id !== product!.id);
        setIsFav(false);
      } else {
        favs.push({
          id: product!.id,
          nom: product!.nom,
          prix: product!.prix,
          img: product!.img,
          origine: product!.origine,
          unite: product!.unite,
        });
        setIsFav(true);
      }
      localStorage.setItem('orixa:favs', JSON.stringify(favs));
      window.dispatchEvent(new Event('orixa:favs-updated'));
    } catch { /* ignore */ }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <p className="text-sm font-medium text-[var(--muted)]">Chargement de la fiche produit ORIXA…</p>
      </div>
    );
  }

  // Slides du carrousel auto-diapo
  const slides = [
    // Slide 1 : Photo produit
    <div key="photo" className="w-full h-full flex items-center justify-center bg-gray-50">
      <img src={product.img} alt={product.nom} className="w-full h-full object-cover" />
    </div>,
    // Slide 2 : Auto-collant badge
    <div key="sticker" className="w-full h-full flex items-center justify-center relative bg-gray-900 text-white">
      <img src={product.img} alt={product.nom} className="w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="px-6 py-3 rounded-2xl shadow-2xl text-lg font-bold rotate-[-4deg] bg-[var(--accent)] text-[var(--brand)] border-2 border-white">
          {product.badge || 'Sélection ORIXA'}
        </div>
      </div>
    </div>,
    // Slide 3 : Combo photo + prix
    <div key="combo" className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <img src={product.img} alt={product.nom} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 text-white">
        <p className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--f-display)' }}>{product.nom}</p>
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">{product.origine}</p>
        <div className="mt-2 text-2xl font-bold text-[var(--accent)]">
          <PriceTag amount={product.prix} />
        </div>
      </div>
    </div>,
  ];

  const pointsFidelite = Math.floor(product.prix * qte);

  return (
    <div className="min-h-screen" style={{ background: theme?.paper || '#FBFAF6', color: theme?.text || '#2C2C2C' }}>
      <Header menu={menu} theme={theme || undefined} />

      {/* Fil d'Ariane */}
      <div className="container py-4">
        <nav className="text-xs uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
          <a href="/" className="hover:text-[var(--accent)]">Accueil</a>
          <span>/</span>
          <a href="/boutique" className="hover:text-[var(--accent)]">Boutique</a>
          <span>/</span>
          <a href={`/${product.cat}`} className="hover:text-[var(--accent)]">
            {product.cat === 'cosmetics' ? 'Cosmétiques' : 'Produits exotiques'}
          </a>
          <span>/</span>
          <span className="text-[var(--brand)] font-semibold">{product.nom}</span>
        </nav>
      </div>

      <div className="container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Diapo produit interactif */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-[var(--line)] relative">
              {slides[slideIndex]}
            </div>

            {/* Indicateurs de slide */}
            <div className="flex justify-center gap-3 py-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === slideIndex ? 'w-8 bg-[var(--accent)]' : 'w-2.5 bg-[var(--line)]'
                  }`}
                  aria-label={`Aller au slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Fiche details */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[var(--accent-dark)] font-bold">
                {product.origine} · {product.unite}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-2 text-[var(--brand)]" style={{ fontFamily: 'var(--f-display)' }}>
                {product.nom}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <PriceTag amount={product.prix} className="text-3xl font-bold text-[var(--brand)]" />
                <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  En stock ({product.stock} disponibles)
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--text)]/80 leading-relaxed border-t border-b border-[var(--line)] py-4">
              {product.description || 'Produit d\'exception d\'origine naturelle certifiée. Sélectionné avec exigence par la Maison ORIXA.'}
            </p>

            {/* Loyalty points notification */}
            <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-4 text-xs flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <p className="font-bold text-[var(--brand)]">Programme Fidélité ORIXA</p>
                <p className="text-[var(--text)]/80">
                  Cet achat vous rapporte <strong>{pointsFidelite} points</strong> (100 € cumulés = bon d'achat de 10 €).
                </p>
              </div>
            </div>

            {/* Quantité + Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Quantité :</label>
                <div className="flex items-center border border-[var(--line)] rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQte(Math.max(1, qte - 1))}
                    className="px-3 py-2 text-sm hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{qte}</span>
                  <button
                    type="button"
                    onClick={() => setQte(Math.min(product.stock, qte + 1))}
                    className="px-3 py-2 text-sm hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={product.stock <= 0}
                  className="btn btn--primary btn--lg flex-1"
                >
                  {addedToCart ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
                </button>
                
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={`btn btn--secondary btn--lg ${isFav ? '!border-red-500 !text-red-500' : ''}`}
                >
                  {isFav ? '♥ Dans les favoris' : '♡ Ajouter aux favoris'}
                </button>
              </div>
            </div>

            {/* Perishable goods note */}
            {product.cat === 'exotic' && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600">
                ⚠️ <strong>Information Hygiène & Alimentation :</strong> Conformément à la réglementation européenne, les denrées périssables scellées ne peuvent pas faire l'objet d'un retour après ouverture.
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer theme={theme || undefined} />
    </div>
  );
}
