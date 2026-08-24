'use client';

import { useState, useMemo } from 'react';
import type { Article } from '@/types';
import { getArticles } from '@/lib/data';

/**
 * Page admin — Gestion des articles.
 * Fidèle au projet orixa-site-complet original.
 */
export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');

  useState(() => {
    getArticles().then(a => { setArticles(a); setLoaded(true); });
  });

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return articles.filter(a => !q || norm(a.titre + ' ' + (a.extrait || '')).includes(q));
  }, [articles, query]);

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Articles</h2>
          <p className="page-sub">Journal de la boutique.</p>
        </div>
        <button className="b b--primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel article
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="qa">Rechercher</label>
            <input className="f__ctrl" id="qa" type="search" placeholder="Titre ou extrait" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Article</th>
                <th>Date</th>
                <th style={{ textAlign: 'center' }}>Statut</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(art => (
                <tr key={art.id}>
                  <td>
                    <strong>{art.titre}</strong>
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--a-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {art.extrait || '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{art.date}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={'pill ' + (art.statut === 'publie' ? 'pill--ok' : 'pill--warn')}>
                      {art.statut === 'publie' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="tbl__num">
                    <button className="b b--default b--sm">Modifier</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--a-muted)', fontSize: '13.5px' }}>
                  Aucun article.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
