'use client';

import { useState } from 'react';
import type { Section } from '@/types';

const DEFAULT_SECTIONS: Section[] = [
  { id: 'hero', type: 'hero', title: 'Bienvenue chez ORIXA', subtitle: 'Cosmétiques naturels & produits exotiques' },
  { id: 'featured', type: 'products', title: 'Nos best-sellers', productIds: ['karite', 'gari', 'hibiscus'] },
];

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero / Bandeau' },
  { value: 'products', label: 'Sélection produits' },
  { value: 'banner', label: 'Bannière image' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'text', label: 'Bloc texte' },
] as const;

/**
 * Page admin — Personnalisation de la boutique (sections d'accueil, thème).
 * Protégée par le middleware (server-side).
 */
export default function AdminPersonnalisationPage() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [theme, setTheme] = useState({
    brand: '#111110',
    paper: '#FBFAF6',
    accent: '#C9A84C',
    announce: 'Livraison offerte dès 80 € d\'achat',
    announceOn: true,
  });

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: 'text',
      title: 'Nouvelle section',
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const updateSection = (id: string, field: keyof Section, value: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSections(prev => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveDown = (index: number) => {
    setSections(prev => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      return copy;
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left panel — Editor */}
      <div className="w-96 flex-shrink-0 flex flex-col border-r overflow-hidden" style={{ borderColor: 'var(--line)', background: 'white' }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <h1 className="text-lg font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Personnalisation
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Configurez l&apos;apparence et les sections de la boutique.
          </p>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Theme colors */}
          <section>
            <h2 className="font-semibold text-sm mb-3">Thème</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Couleur principale</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.brand}
                    onChange={e => setTheme(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.brand}
                    onChange={e => setTheme(prev => ({ ...prev, brand: e.target.value }))}
                    className="flex-1 px-2 py-1 text-sm border rounded font-mono"
                    style={{ borderColor: 'var(--line)' }}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Couleur d&apos;accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={e => setTheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.accent}
                    onChange={e => setTheme(prev => ({ ...prev, accent: e.target.value }))}
                    className="flex-1 px-2 py-1 text-sm border rounded font-mono"
                    style={{ borderColor: 'var(--line)' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={theme.announceOn}
                  onChange={e => setTheme(prev => ({ ...prev, announceOn: e.target.checked }))}
                  className="rounded"
                />
                <label className="text-xs">Bandeau d&apos;annonce actif</label>
              </div>
              <input
                type="text"
                value={theme.announce}
                onChange={e => setTheme(prev => ({ ...prev, announce: e.target.value }))}
                className="w-full px-2 py-1 text-sm border rounded"
                style={{ borderColor: 'var(--line)' }}
                placeholder="Texte du bandeau"
              />
            </div>
          </section>

          {/* Sections */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Sections de la page d&apos;accueil</h2>
              <button className="btn btn--secondary btn--sm" onClick={addSection}>
                + Section
              </button>
            </div>
            <div className="space-y-3">
              {sections.map((section, i) => (
                <div key={section.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <select
                      value={section.type}
                      onChange={e => updateSection(section.id, 'type', e.target.value)}
                      className="text-xs px-2 py-1 border rounded"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      {SECTION_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <button
                        className="btn btn--ghost btn--sm p-1 text-xs"
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                      >↑</button>
                      <button
                        className="btn btn--ghost btn--sm p-1 text-xs"
                        onClick={() => moveDown(i)}
                        disabled={i === sections.length - 1}
                      >↓</button>
                      <button
                        className="btn btn--ghost btn--sm p-1 text-xs text-red-500"
                        onClick={() => removeSection(section.id)}
                      >×</button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={e => updateSection(section.id, 'title', e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded mb-1"
                    style={{ borderColor: 'var(--line)' }}
                    placeholder="Titre de la section"
                  />
                  <input
                    type="text"
                    value={section.subtitle || ''}
                    onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                    className="w-full px-2 py-1 text-xs border rounded"
                    style={{ borderColor: 'var(--line)' }}
                    placeholder="Sous-titre"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--line)' }}>
          <button className="btn btn--primary btn--sm w-full">
            Enregistrer et publier
          </button>
          <button className="btn btn--secondary btn--sm w-full">
            Rétablir le thème d&apos;origine
          </button>
        </div>
      </div>

      {/* Right panel — Preview */}
      <div className="flex-1 flex flex-col">
        {/* Preview bar */}
        <div className="p-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}>
          <div className="flex gap-1">
            <button className="px-2 py-1 text-xs rounded font-medium" style={{ background: 'var(--accent)', color: 'white' }}>
              Ordinateur
            </button>
            <button className="px-2 py-1 text-xs rounded" style={{ background: 'white', border: '1px solid var(--line)' }}>
              Tablette
            </button>
            <button className="px-2 py-1 text-xs rounded" style={{ background: 'white', border: '1px solid var(--line)' }}>
              Mobile
            </button>
          </div>
          <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>À jour</span>
        </div>

        {/* Iframe preview placeholder */}
        <div className="flex-1 flex items-center justify-center" style={{ background: '#e5e5e0' }}>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ width: '80%', maxWidth: '1200px', aspectRatio: '16/10' }}>
            <div className="h-full flex items-center justify-center" style={{ color: 'var(--muted)' }}>
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Aperçu de la boutique</p>
                <p className="text-sm">L&apos;aperçu se chargera après avoir connecté le thème au site.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
