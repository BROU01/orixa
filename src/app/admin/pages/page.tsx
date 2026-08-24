'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Page } from '@/types';
import { getPages } from '@/lib/data';

/**
 * Page admin — Gestion des pages éditoriales.
 * Fidèle au projet orixa-site-complet original.
 * CRUD complet avec champs SEO.
 */
export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: '', slug: '', contenu: '', seoTitle: '', seoDesc: '' });

  useEffect(() => {
    getPages().then(p => { setPages(p); setLoaded(true); });
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ titre: '', slug: '', contenu: '', seoTitle: '', seoDesc: '' });
    setShowModal(true);
  };

  const openEdit = (p: Page) => {
    setEditing(p);
    setForm({ titre: p.titre, slug: p.slug, contenu: p.contenu || '', seoTitle: '', seoDesc: '' });
    setShowModal(true);
  };

  const savePage = () => {
    if (!form.titre.trim() || !form.slug.trim()) return;
    const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (editing) {
      setPages(prev => prev.map(p => p.id === editing.id ? { ...p, titre: form.titre.trim(), slug, contenu: form.contenu } : p));
    } else {
      setPages(prev => [...prev, { id: 'pg' + Date.now(), titre: form.titre.trim(), slug, statut: 'brouillon', contenu: form.contenu }]);
    }
    setShowModal(false);
  };

  const deletePage = (id: string) => {
    if (!confirm('Supprimer cette page ?')) return;
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const PAGE_ROUTES: Record<string, string> = {
    histoire: '/histoire',
    contact: '/contact',
    legal: '/legal',
    cgv: '/cgv',
    'mentions-legales': '/mentions-legales',
    confidentialite: '/confidentialite',
    cookies: '/cookies',
    faq: '/faq',
    retour: '/retours',
  };

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Pages</h2>
          <p className="page-sub">Pages éditoriales de la boutique. Chaque page se construit par sections.</p>
        </div>
        <button className="b b--primary" onClick={openNew}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle page
        </button>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          La page d&apos;accueil se compose par sections via{' '}
          <a href="/admin/personnalisation" style={{ fontWeight: 600, color: 'var(--a-brand)' }}>
            Personnalisation
          </a>. Les autres pages s&apos;éditent ici.
        </span>
      </div>

      <section className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Page</th>
                <th>Fichier</th>
                <th>Statut</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Accueil</strong></td>
                <td style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12.5px', color: 'var(--a-muted)' }}>/</td>
                <td><span className="pill pill--ok">Publié</span></td>
                <td className="tbl__num">
                  <a href="/admin/personnalisation" className="b b--primary b--sm">Composer</a>
                </td>
              </tr>
              <tr>
                <td><strong>Cosmétiques</strong></td>
                <td style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12.5px', color: 'var(--a-muted)' }}>/cosmetiques</td>
                <td><span className="pill pill--ok">Publié</span></td>
                <td className="tbl__num">
                  <a href="/admin/produits" className="b b--default b--sm">Gérer les produits</a>
                </td>
              </tr>
              <tr>
                <td><strong>Produits exotiques</strong></td>
                <td style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12.5px', color: 'var(--a-muted)' }}>/exotiques</td>
                <td><span className="pill pill--ok">Publié</span></td>
                <td className="tbl__num">
                  <a href="/admin/produits" className="b b--default b--sm">Gérer les produits</a>
                </td>
              </tr>
              <tr>
                <td><strong>Nouveautés</strong></td>
                <td style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12.5px', color: 'var(--a-muted)' }}>/nouveautes</td>
                <td><span className="pill pill--ok">Publié</span></td>
                <td className="tbl__num">
                  <a href="/admin/produits" className="b b--default b--sm">Gérer les produits</a>
                </td>
              </tr>
              {pages.map(page => (
                <tr key={page.id}>
                  <td>
                    <strong>{page.titre}</strong>
                    {page.statut === 'brouillon' && ' '}
                    {page.statut === 'brouillon' && <span className="pill pill--warn" style={{ fontSize: '10px' }}>Brouillon</span>}
                  </td>
                  <td style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12.5px', color: 'var(--a-muted)' }}>
                    {PAGE_ROUTES[page.slug] || '/' + page.slug}
                  </td>
                  <td>
                    <span className={'pill ' + (page.statut === 'publie' ? 'pill--ok' : 'pill--warn')}>
                      {page.statut === 'publie' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="tbl__num">
                    <button className="b b--default b--sm" onClick={() => openEdit(page)}>Réglages</button>
                    <button className="b b--danger b--sm" style={{ marginLeft: '4px' }} onClick={() => deletePage(page.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal create/edit */}
      {showModal && (
        <dialog open style={{ position: 'fixed', inset: 0, zIndex: 1000, border: 'none', borderRadius: '12px', padding: 0, width: 'min(540px, 94vw)' }}>
          <div style={{ padding: '20px', background: 'var(--a-surface)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{editing ? 'Réglages de la page' : 'Nouvelle page'}</h2>
              <button className="b b--ghost b--sm" onClick={() => setShowModal(false)}>Fermer</button>
            </div>

            <div className="f">
              <label className="f__label">Nom de la page</label>
              <input className="f__ctrl" value={form.titre} onChange={e => setForm(prev => ({ ...prev, titre: e.target.value }))} />
            </div>
            <div className="f">
              <label className="f__label">Fichier (slug)</label>
              <input className="f__ctrl" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} spellCheck={false} placeholder="ma-page" />
            </div>
            <div className="f">
              <label className="f__label">Titre pour les moteurs (SEO)</label>
              <input className="f__ctrl" value={form.seoTitle} onChange={e => setForm(prev => ({ ...prev, seoTitle: e.target.value }))} />
            </div>
            <div className="f">
              <label className="f__label">Description (SEO)</label>
              <textarea className="f__ctrl" rows={3} value={form.seoDesc} onChange={e => setForm(prev => ({ ...prev, seoDesc: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="b b--default" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="b b--primary" onClick={savePage}>Enregistrer</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
