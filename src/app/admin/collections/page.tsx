'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Collection } from '@/types';
import { getCollections, getProducts } from '@/lib/data';

/**
 * Page admin — Gestion des collections.
 * Fidèle au projet orixa-site-complet original.
 * CRUD complet avec modales.
 */
export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<{ cat: string }[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nouvelle collection');
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState({ label: '', id: '', desc: '' });

  useEffect(() => {
    Promise.all([getCollections(), getProducts()]).then(([c, p]) => {
      setCollections(c);
      setProducts(p);
      setLoaded(true);
    });
  }, []);

  const countProducts = (slug: string) => products.filter(p => p.cat === slug).length;

  const openNew = () => {
    setEditing(null);
    setModalTitle('Nouvelle collection');
    setForm({ label: '', id: '', desc: '' });
    setShowModal(true);
  };

  const openEdit = (c: Collection) => {
    setEditing(c);
    setModalTitle('Modifier la collection');
    setForm({ label: c.titre, id: c.slug, desc: c.desc || '' });
    setShowModal(true);
  };

  const save = () => {
    const label = form.label.trim();
    const id = form.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!label || !id) return;
    if (editing) {
      setCollections(prev => prev.map(c => c.slug === editing.slug ? { ...c, titre: label, desc: form.desc } : c));
    } else {
      if (collections.some(c => c.slug === id)) return;
      setCollections(prev => [...prev, { id, slug: id, titre: label, desc: form.desc, on: true, ids: [] }]);
    }
    setShowModal(false);
  };

  const remove = (slug: string) => {
    const n = products.filter(p => p.cat === slug).length;
    if (n > 0) return;
    if (!confirm('Supprimer cette collection ?')) return;
    setCollections(prev => prev.filter(c => c.slug !== slug));
  };

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Collections</h2>
          <p className="page-sub">Les rayons affichés dans le menu et la boutique.</p>
        </div>
        <button className="b b--primary" onClick={openNew}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle collection
        </button>
      </div>

      <section className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Identifiant</th>
                <th>Description</th>
                <th className="tbl__num">Produits</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(c => (
                <tr key={c.slug}>
                  <td><strong>{c.titre}</strong></td>
                  <td style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '12.5px', color: 'var(--a-muted)' }}>{c.slug}</td>
                  <td style={{ fontSize: '12.5px', color: 'var(--a-muted)' }}>{c.desc || '—'}</td>
                  <td className="tbl__num">{countProducts(c.slug)}</td>
                  <td className="tbl__num">
                    <button className="b b--default b--sm" onClick={() => openEdit(c)}>Modifier</button>
                    {' '}
                    <button className="b b--danger b--sm" onClick={() => remove(c.slug)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <dialog open style={{ width: 'min(540px, 94vw)', padding: 0, border: 'none', borderRadius: 'var(--a-r)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--a-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600 }}>{modalTitle}</h2>
            <button className="b b--ghost b--sm" onClick={() => setShowModal(false)}>Fermer</button>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="f">
              <label className="f__label" htmlFor="c-label">Nom affiché</label>
              <input className="f__ctrl" id="c-label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            </div>
            <div className="f">
              <label className="f__label" htmlFor="c-id">Identifiant</label>
              <input className="f__ctrl" id="c-id" spellCheck={false} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} disabled={!!editing} />
              <p className="f__hint">Sert dans l&apos;adresse : /cosmetiques?cat=identifiant</p>
            </div>
            <div className="f">
              <label className="f__label" htmlFor="c-desc">Description</label>
              <textarea className="f__ctrl" id="c-desc" rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
            </div>
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--a-line)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="b b--default" onClick={() => setShowModal(false)}>Annuler</button>
            <button className="b b--primary" onClick={save}>Enregistrer</button>
          </div>
        </dialog>
      )}
    </div>
  );
}
