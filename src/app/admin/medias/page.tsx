'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { Media } from '@/types';
import { getMedia } from '@/lib/data';

/**
 * Page admin — Médiathèque.
 * Fidèle au projet orixa-site-complet original.
 * Recherche, grille, upload.
 */
export default function AdminMediasPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getMedia().then(m => { setMedia(m); setLoaded(true); });
  }, []);

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return media.filter(m => !q || norm(m.name).includes(q));
  }, [media, query]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let done = 0;
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(prev => [...prev, { src: reader.result as string, name: f.name, builtin: false }]);
        if (++done === files.length) alert(done + ' fichier(s) ajouté(s).');
      };
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  }, []);

  const handleDelete = useCallback((src: string) => {
    if (!confirm('Supprimer ce média ?')) return;
    setMedia(prev => prev.filter(m => m.src !== src));
  }, []);

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Médiathèque</h2>
          <p className="page-sub">{media.length} fichiers disponibles.</p>
        </div>
        <label className="b b--primary" style={{ cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Téléverser
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
        </label>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          Les images téléversées sont encodées dans le stockage du navigateur (limite ~4 Mo).
          En production, elles iraient sur un espace de stockage serveur.
        </span>
      </div>

      <div style={{
        border: '2px dashed var(--a-line-2)',
        borderRadius: 'var(--a-r)',
        padding: '32px',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '13.5px', color: 'var(--a-muted)' }}>
          Glissez vos images ici ou cliquez sur &laquo; Téléverser &raquo;
        </p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="qm">Rechercher</label>
            <input className="f__ctrl" id="qm" type="search" placeholder="Rechercher par nom de fichier…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__body">
          <div className="mgrid">
            {filtered.map((m, i) => (
              <div key={i} className="mgrid__i" style={{ position: 'relative' }}>
                <img src={m.src} alt={m.name} loading="lazy" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <span style={{ padding: '6px 8px', fontSize: '11px', color: 'var(--a-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                  {m.name}
                </span>
                {!m.builtin && (
                  <button
                    onClick={() => handleDelete(m.src)}
                    style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '1px solid var(--a-line)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, lineHeight: 1, color: 'var(--a-muted)' }}
                    aria-label="Supprimer"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--a-muted)', fontSize: '13.5px' }}>
                Aucun fichier. Glissez ou téléversez des images.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
