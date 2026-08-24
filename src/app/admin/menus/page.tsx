'use client';

import { useState } from 'react';
import type { MenuItem } from '@/types';

const DEFAULT_MENU: MenuItem[] = [
  { label: 'Boutique', url: '/cosmetiques', on: true, children: [
    { label: 'Cosmétiques', url: '/cosmetiques', on: true },
    { label: 'Produits exotiques', url: '/exotiques', on: true },
    { label: 'Nouveautés', url: '/nouveautes', on: true },
  ]},
  { label: 'Notre histoire', url: '/histoire', on: true },
  { label: 'Contact', url: '/contact', on: true },
];

interface FooterColumn {
  title: string;
  links: Array<{ label: string; url: string }>;
}

const DEFAULT_FOOTER: FooterColumn[] = [
  { title: 'La maison', links: [{ label: 'Notre histoire', url: '/histoire' }, { label: 'Nos valeurs', url: '/nos-valeurs' }] },
  { title: 'Boutique', links: [{ label: 'Cosmétiques', url: '/cosmetiques' }, { label: 'Produits exotiques', url: '/exotiques' }] },
  { title: 'Services', links: [{ label: 'Contact', url: '/contact' }, { label: 'FAQ', url: '/faq' }, { label: 'Retours', url: '/retours' }] },
  { title: 'Mon compte', links: [{ label: 'Connexion', url: '/compte' }, { label: 'Mes favoris', url: '/favoris' }] },
  { title: 'Informations', links: [{ label: 'Mentions légales', url: '/mentions-legales' }, { label: 'CGV', url: '/cgv' }, { label: 'Confidentialité', url: '/confidentialite' }] },
];

/**
 * Page admin — Éditeur de menus de navigation.
 * Fidèle au projet orixa-site-complet original.
 */
export default function AdminMenusPage() {
  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU);
  const [footer, setFooter] = useState<FooterColumn[]>(DEFAULT_FOOTER);

  const toggleItem = (index: number) => {
    setMenu(prev => prev.map((m, i) =>
      i === index ? { ...m, on: m.on === false ? true : false } : m
    ));
  };

  const updateLabel = (index: number, value: string) => {
    setMenu(prev => prev.map((m, i) => i === index ? { ...m, label: value } : m));
  };

  const updateUrl = (index: number, value: string) => {
    setMenu(prev => prev.map((m, i) => i === index ? { ...m, url: value } : m));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setMenu(prev => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveDown = (index: number) => {
    setMenu(prev => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setMenu(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setMenu(prev => [...prev, { label: 'Nouveau lien', url: '/', on: true }]);
  };

  const updateFooterTitle = (index: number, value: string) => {
    setFooter(prev => prev.map((c, i) => i === index ? { ...c, title: value } : c));
  };

  const moveFooterUp = (index: number) => {
    if (index === 0) return;
    setFooter(prev => { const copy = [...prev]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; return copy; });
  };

  const moveFooterDown = (index: number) => {
    setFooter(prev => { if (index >= prev.length - 1) return prev; const copy = [...prev]; [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]]; return copy; });
  };

  const removeFooterCol = (index: number) => {
    setFooter(prev => prev.filter((_, i) => i !== index));
  };

  const addFooterCol = () => {
    setFooter(prev => [...prev, { title: 'Nouvelle colonne', links: [] }]);
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Navigation</h2>
          <p className="page-sub">Menu principal et colonnes du pied de page.</p>
        </div>
        <button className="b b--primary">Enregistrer</button>
      </div>

      <div className="grid-2">
        {/* Éditeur */}
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Entrées du menu</h3>
            <button className="b b--default b--sm" onClick={addItem}>+ Ajouter</button>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {menu.map((item, i) => (
              <div key={i} className="mitem">
                <div className="mitem__h">
                  <label className="switch" style={{ flex: 'none' }}>
                    <input
                      type="checkbox"
                      checked={item.on !== false}
                      onChange={() => toggleItem(i)}
                    />
                    <span className="switch__track"></span>
                  </label>
                  <input
                    className="f__ctrl"
                    style={{ flex: 1 }}
                    value={item.label}
                    onChange={e => updateLabel(i, e.target.value)}
                    aria-label="Libellé"
                  />
                  <input
                    className="f__ctrl"
                    style={{ flex: 1 }}
                    value={item.url}
                    onChange={e => updateUrl(i, e.target.value)}
                    aria-label="Lien"
                  />
                  <button className="ibtn" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Monter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <button className="ibtn" onClick={() => moveDown(i)} disabled={i === menu.length - 1} aria-label="Descendre">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  <button className="ibtn ibtn--danger" onClick={() => removeItem(i)} aria-label="Supprimer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonnes footer */}
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Colonnes du pied de page</h3>
            <button className="b b--default b--sm" onClick={addFooterCol}>+ Colonne</button>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {footer.map((col, i) => (
              <div key={i} className="mitem">
                <div className="mitem__h">
                  <span className="rep__n" style={{ flex: 'none', width: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--a-muted)' }}>{i + 1}</span>
                  <input
                    className="f__ctrl"
                    style={{ flex: 1 }}
                    value={col.title}
                    onChange={e => updateFooterTitle(i, e.target.value)}
                    aria-label="Titre colonne"
                  />
                  <button className="ibtn" onClick={() => moveFooterUp(i)} disabled={i === 0} aria-label="Monter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <button className="ibtn" onClick={() => moveFooterDown(i)} disabled={i === footer.length - 1} aria-label="Descendre">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                  <button className="ibtn ibtn--danger" onClick={() => removeFooterCol(i)} aria-label="Supprimer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--a-muted)', padding: '4px 0 0 28px' }}>
                  {col.links.length} lien(s) : {col.links.map(l => l.label).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
