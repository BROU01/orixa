'use client';

import { useState } from 'react';
import type { MenuItem } from '@/types';

const DEFAULT_MENU: MenuItem[] = [
  { label: 'Boutique', url: '/boutique', on: true, children: [
    { label: 'Cosmétiques', url: '/cosmetiques', on: true },
    { label: 'Produits exotiques', url: '/exotiques', on: true },
    { label: 'Nouveautés', url: '/nouveautes', on: true },
  ]},
  { label: 'Notre histoire', url: '/histoire', on: true },
  { label: 'Contact', url: '/contact', on: true },
];

/**
 * Page admin — Éditeur de menus de navigation.
 * Protégée par le middleware (server-side).
 */
export default function AdminMenusPage() {
  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU);

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Menus
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Navigation principale de la boutique.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn--secondary btn--sm">Rétablir</button>
          <button className="btn btn--primary btn--sm">Enregistrer</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Menu items editor */}
        <div className="card">
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-semibold text-sm">Entrées du menu</h2>
            <button className="btn btn--secondary btn--sm" onClick={addItem}>
              + Ajouter
            </button>
          </div>
          <div className="p-4 space-y-3">
            {menu.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.on !== false}
                    onChange={() => toggleItem(i)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <input
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  style={{ borderColor: 'var(--line)' }}
                  value={item.label}
                  onChange={e => updateLabel(i, e.target.value)}
                  aria-label="Libellé"
                />
                <input
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  style={{ borderColor: 'var(--line)' }}
                  value={item.url}
                  onChange={e => updateUrl(i, e.target.value)}
                  aria-label="Lien"
                />
                <button
                  className="btn btn--ghost btn--sm p-1"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  aria-label="Monter"
                >↑</button>
                <button
                  className="btn btn--ghost btn--sm p-1"
                  onClick={() => moveDown(i)}
                  disabled={i === menu.length - 1}
                  aria-label="Descendre"
                >↓</button>
                <button
                  className="btn btn--ghost btn--sm p-1 text-red-500"
                  onClick={() => removeItem(i)}
                  aria-label="Supprimer"
                >×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <div className="p-4 border-b" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-semibold text-sm">Aperçu</h2>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {menu.filter(m => m.on !== false).map((item, i) => (
                <div key={i} className="relative group">
                  <span className="px-3 py-1.5 text-sm rounded-lg" style={{ background: 'var(--bg)' }}>
                    {item.label}
                  </span>
                  {item.children && item.children.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 hidden group-hover:block z-10">
                      <div className="bg-white rounded-lg shadow-lg border p-2 min-w-[160px]" style={{ borderColor: 'var(--line)' }}>
                        {item.children.filter(c => c.on !== false).map((child, j) => (
                          <div key={j} className="px-3 py-1.5 text-sm hover:bg-gray-50 rounded">
                            {child.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
              Les sous-entrées apparaissent dans un menu déroulant au survol de leur parent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
