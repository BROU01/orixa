'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product, Category, MenuItem, Theme } from '@/types';
import { getProducts, getCategories, getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';

export default function RayonDynamicPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    Promise.all([getProducts(), getCategories(), getMenu(), getTheme()]).then(
      ([allProducts, allCats, m, t]) => {
        setMenu(m);
        setTheme(t);
        setCategories(allCats);

        if (id) {
          const found = allCats.find((c) => c.slug === id || c.id === id);
          if (found) {
            setCategory(found);
            const filtered = allProducts.filter((p) => p.cat === found.id);
            setProducts(filtered);
          } else {
            setProducts(allProducts);
          }
        } else {
          setProducts(allProducts);
        }
      }
    );
  }, []);

  const getSortedProducts = () => {
    const copy = [...products];
    if (sortOrder === 'asc') return copy.sort((a, b) => a.prix - b.prix);
    if (sortOrder === 'desc') return copy.sort((a, b) => b.prix - a.prix);
    return copy;
  };

  const sortedList = getSortedProducts();

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme || undefined} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">{category?.label || 'Rayon'}</span>
        </nav>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0 }}>
        {category?.image && (
          <div
            className="rayon-hero rayon-hero--img mb-8"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div className="rayon-hero__inner">
              <span className="eyebrow">Rayon spécialisé</span>
              <h1 className="h-display h1">{category.label}</h1>
              <p className="lede">{category.desc}</p>
            </div>
          </div>
        )}

        {!category?.image && (
          <>
            <span className="eyebrow">Rayon spécialisé</span>
            <h1 className="h-display h1" style={{ marginTop: '8px' }}>
              {category?.label || 'Rayon MAISON LA GRACE'}
            </h1>
            <p className="lede" style={{ marginTop: '8px' }}>
              {category?.desc || 'Sélection exclusive d\'articles authentiques.'}
            </p>
          </>
        )}
      </div>

      <div className="wrap mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="cat-pills">
          <a href="/cosmetiques" className="cat-pill">Cosmétiques</a>
          <a href="/exotiques" className="cat-pill">Exotiques</a>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/rayon?id=${c.slug}`}
              className={`cat-pill ${c.id === category?.id ? 'active' : ''}`}
              aria-current={c.id === category?.id ? 'page' : undefined}
            >
              {c.label}
            </a>
          ))}
        </div>

        <div className="sort">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select"
          >
            <option value="default">Tri par défaut</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      <div className="wrap section--tight" style={{ paddingTop: 0, paddingBottom: '96px' }}>
        <div className="prod-grid">
          {sortedList.map((product) => (
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
      </div>

      <Footer theme={theme || undefined} />
    </div>
  );
}
