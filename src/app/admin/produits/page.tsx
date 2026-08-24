'use client';

import { useState, useMemo } from 'react';
import type { Product, Category } from '@/types';
import { getProducts, getCategories } from '@/lib/data';

/**
 * Page admin — Gestion des produits.
 * Fidèle au projet orixa-site-complet original.
 * Recherche, filtres, modification, export CSV.
 */
export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nouveau produit');
  const [form, setForm] = useState({ nom: '', prix: '', stock: '', cat: '', unite: '', origine: '', badge: '', img: '', description: '' });

  // Charger les données au montage
  useState(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoaded(true);
    });
  });

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return products.filter(p => {
      if (catFilter && p.cat !== catFilter) return false;
      if (stockFilter === 'low' && !(p.stock > 0 && p.stock < 35)) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;
      if (q && !norm(p.nom + ' ' + p.origine + ' ' + p.unite).includes(q)) return false;
      return true;
    });
  }, [products, query, catFilter, stockFilter]);

  const catLabel = (catId: string) => categories.find(c => c.id === catId)?.label || catId;

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const openNew = () => {
    setEditing(null);
    setModalTitle('Nouveau produit');
    setForm({ nom: '', prix: '', stock: '0', cat: categories[0]?.id || '', unite: '', origine: '', badge: '', img: 'assets/img/placeholder.svg', description: '' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setModalTitle('Modifier le produit');
    setForm({ nom: p.nom, prix: String(p.prix), stock: String(p.stock), cat: p.cat, unite: p.unite, origine: p.origine, badge: p.badge || '', img: p.img, description: p.description || '' });
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!form.nom.trim()) return;
    const payload = {
      nom: form.nom.trim(),
      prix: parseInt(form.prix, 10) || 0,
      stock: parseInt(form.stock, 10) || 0,
      cat: form.cat,
      unite: form.unite.trim(),
      origine: form.origine.trim(),
      badge: (form.badge || '') as Product['badge'],
      img: form.img.trim() || 'assets/img/placeholder.svg',
      description: form.description.trim(),
    };
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
    } else {
      const id = 'p' + Date.now();
      setProducts(prev => [{ ...payload, id, slug: id, badge: payload.badge as Product['badge'] }, ...prev]);
    }
    setShowModal(false);
  };

  const deleteSelected = () => {
    if (!confirm('Supprimer ' + selected.size + ' produit(s) ?')) return;
    setProducts(prev => prev.filter(p => !selected.has(p.id)));
    setSelected(new Set());
  };

  const bulkStock = () => {
    const v = prompt('Nouveau niveau de stock pour ' + selected.size + ' produit(s) :', '50');
    if (v === null) return;
    const n = parseInt(v, 10);
    if (isNaN(n) || n < 0) return;
    setProducts(prev => prev.map(p => selected.has(p.id) ? { ...p, stock: n } : p));
  };

  const bulkCat = () => {
    const lbl = categories.map((c, i) => (i + 1) + ' = ' + c.label).join('\n');
    const r = prompt('Nouveau rayon pour ' + selected.size + ' produit(s) :\n' + lbl, '1');
    if (r === null) return;
    const idx = parseInt(r, 10) - 1;
    if (!categories[idx]) return;
    setProducts(prev => prev.map(p => selected.has(p.id) ? { ...p, cat: categories[idx].id } : p));
  };

  const exportCSV = () => {
    const header = 'id,nom,cat,prix,unite,stock,origine';
    const rows = products.map(p => [p.id, p.nom, p.cat, p.prix, p.unite, p.stock, p.origine].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orixa-produits.csv';
    a.click();
  };

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Produits</h2>
          <p className="page-sub"><span>{products.length}</span> références au catalogue.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="b b--default" onClick={exportCSV}>Exporter en CSV</button>
          <button className="b b--primary" onClick={openNew}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ajouter un produit
          </button>
        </div>
      </div>

      <section className="card">
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="q">Rechercher un produit</label>
            <input className="f__ctrl" id="q" type="search" placeholder="Nom, provenance ou conditionnement" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <label className="visually-hidden" htmlFor="fcat">Filtrer par rayon</label>
          <select className="f__ctrl" id="fcat" style={{ width: 'auto' }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="">Tous les rayons</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <label className="visually-hidden" htmlFor="fstock">Filtrer par stock</label>
          <select className="f__ctrl" id="fstock" style={{ width: 'auto' }} value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option value="">Tout stock</option>
            <option value="low">Stock faible (&lt; 35)</option>
            <option value="out">En rupture</option>
          </select>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: '36px' }}>
                  <label className="visually-hidden" htmlFor="all">Tout sélectionner</label>
                  <input type="checkbox" id="all" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                <th>Produit</th>
                <th>Rayon</th>
                <th>Provenance</th>
                <th className="tbl__num">Prix</th>
                <th className="tbl__num">Stock</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cls = p.stock <= 0 ? 'pill--danger' : p.stock < 35 ? 'pill--warn' : 'pill--ok';
                return (
                  <tr key={p.id}>
                    <td><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} aria-label={'Sélectionner ' + p.nom} /></td>
                    <td>
                      <div className="cell-prod">
                        <img className="thumb" src={p.img} alt="" />
                        <div>
                          <div className="cell-prod__name">{p.nom}</div>
                          <div className="cell-prod__meta">{p.unite}{p.badge ? ' · ' + p.badge : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>{catLabel(p.cat)}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--a-muted)' }}>{p.origine}</td>
                    <td className="tbl__num">{p.prix.toFixed(2)} €</td>
                    <td className="tbl__num"><span className={'pill ' + cls}>{p.stock <= 0 ? 'Rupture' : p.stock}</span></td>
                    <td className="tbl__num"><button className="b b--default b--sm" onClick={() => openEdit(p)}>Modifier</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && <div className="empty-a">Aucun produit ne correspond à cette recherche.</div>}

        <div className="card__foot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--a-muted)' }}>{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="b b--default b--sm" disabled={selected.size === 0} onClick={bulkStock}>Modifier le stock</button>
            <button className="b b--default b--sm" disabled={selected.size === 0} onClick={bulkCat}>Changer de rayon</button>
            <button className="b b--danger b--sm" disabled={selected.size === 0} onClick={deleteSelected}>Supprimer</button>
          </div>
        </div>
      </section>

      {/* Modal édition produit */}
      {showModal && (
        <dialog open style={{ width: 'min(600px, 94vw)', padding: 0, border: 'none', borderRadius: 'var(--a-r)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--a-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600 }}>{modalTitle}</h2>
            <button className="b b--ghost b--sm" onClick={() => setShowModal(false)}>Fermer</button>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="f">
              <label className="f__label" htmlFor="m-nom">Nom du produit</label>
              <input className="f__ctrl" id="m-nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
            </div>
            <div className="f-row">
              <div className="f">
                <label className="f__label" htmlFor="m-prix">Prix (€)</label>
                <input className="f__ctrl" id="m-prix" type="number" min="0" step="0.50" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="m-stock">Stock</label>
                <input className="f__ctrl" id="m-stock" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>
            <div className="f-row">
              <div className="f">
                <label className="f__label" htmlFor="m-cat">Rayon</label>
                <select className="f__ctrl" id="m-cat" value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="f">
                <label className="f__label" htmlFor="m-unite">Conditionnement</label>
                <input className="f__ctrl" id="m-unite" placeholder="1 kg" value={form.unite} onChange={e => setForm(f => ({ ...f, unite: e.target.value }))} />
              </div>
            </div>
            <div className="f-row">
              <div className="f">
                <label className="f__label" htmlFor="m-origine">Provenance</label>
                <input className="f__ctrl" id="m-origine" placeholder="Togo — Plateaux" value={form.origine} onChange={e => setForm(f => ({ ...f, origine: e.target.value }))} />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="m-badge">Étiquette</label>
                <select className="f__ctrl" id="m-badge" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                  <option value="">Aucune</option>
                  <option>Nouveau</option>
                  <option>Populaire</option>
                  <option>Best-seller</option>
                  <option>Promo</option>
                </select>
              </div>
            </div>
            <div className="f">
              <label className="f__label" htmlFor="m-desc">Description</label>
              <textarea className="f__ctrl" id="m-desc" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--a-line)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="b b--default" onClick={() => setShowModal(false)}>Annuler</button>
            <button className="b b--primary" onClick={saveProduct}>Enregistrer</button>
          </div>
        </dialog>
      )}
    </div>
  );
}
