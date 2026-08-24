'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Category, Product } from '@/types';
import { getCategories, getProducts } from '@/lib/data';

/**
 * Page admin — Gestion des rayons du catalogue.
 * Fidèle au projet orixa-site-complet original.
 */
export default function AdminRayonsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    Promise.all([getCategories(), getProducts()]).then(([c, p]) => {
      setCategories(c);
      setProducts(p);
      setLoaded(true);
    });
  }, []);

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return categories.filter(c => !q || norm(c.label + ' ' + (c.desc || '')).includes(q));
  }, [categories, query]);

  const countProducts = (catId: string) => products.filter(p => p.cat === catId).length;

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Rayons</h2>
          <p className="page-sub">Chaque rayon a sa page dédiée et son entrée dans la navigation.</p>
        </div>
        <button className="b b--primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter un rayon
        </button>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          Chaque rayon a sa page publique, <strong>générée automatiquement</strong> :
          <strong> cosmetiques</strong> et <strong> exotiques</strong> pour les pages dédiées,
          et la page <strong>nouveautes</strong> pour les nouveautés.
          Le libellé, la description et les produits y sont toujours à jour.
        </span>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="rr">Rechercher</label>
            <input className="f__ctrl" id="rr" type="search" placeholder="Nom ou description du rayon" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Rayon</th>
                <th>Page</th>
                <th>Description</th>
                <th className="tbl__num">Produits</th>
                <th style={{ textAlign: 'center' }}>Visibilité</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <strong>{cat.label}</strong>
                    {cat.color && (
                      <span style={{
                        marginLeft: '8px',
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '999px',
                        background: cat.color,
                        verticalAlign: 'middle',
                      }} />
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>
                    {cat.slug ? '/' + cat.slug : 'rayon?id=' + cat.id}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.desc || '—'}
                  </td>
                  <td className="tbl__num">{countProducts(cat.id)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={'pill ' + (cat.on !== false ? 'pill--ok' : 'pill--neutral')}>
                      {cat.on !== false ? 'Visible' : 'Masqué'}
                    </span>
                  </td>
                  <td className="tbl__num" style={{ whiteSpace: 'nowrap' }}>
                    <button className="b b--default b--sm">Modifier</button>
                    {' '}
                    <button className="b b--ghost b--sm">Page</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--a-muted)', fontSize: '13.5px' }}>
                  Aucun rayon.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
