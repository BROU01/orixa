'use client';

import { useState, useRef } from 'react';
import type { Section } from '@/types';

const DEFAULT_SECTIONS: Section[] = [
  { id: 'hero', type: 'hero', title: 'Bienvenue chez MAISON LA GRACE', subtitle: 'Cosmétiques naturels & produits exotiques' },
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
 * Page admin — Personnalisation de la boutique.
 * Fidèle au projet orixa-site-complet original.
 */
export default function AdminPersonnalisationPage() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const frameRef = useRef<HTMLIFrameElement>(null);
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
    <div className="ed">
      {/* Panel gauche — Éditeur */}
      <div className="ed__panel">
        <div className="ed__head">
          <a className="ed__back" href="/admin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </a>
          <span className="ed__title">Personnalisation</span>
        </div>

        <div className="ed__block">
          <p className="ed__eyebrow">Thème</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="f__label">Couleur principale</label>
              <div className="color-row">
                <input
                  type="color"
                  value={theme.brand}
                  onChange={e => setTheme(prev => ({ ...prev, brand: e.target.value }))}
                />
                <input
                  type="text"
                  value={theme.brand}
                  onChange={e => setTheme(prev => ({ ...prev, brand: e.target.value }))}
                  className="f__ctrl"
                />
              </div>
            </div>
            <div>
              <label className="f__label">Couleur d&apos;accent</label>
              <div className="color-row">
                <input
                  type="color"
                  value={theme.accent}
                  onChange={e => setTheme(prev => ({ ...prev, accent: e.target.value }))}
                />
                <input
                  type="text"
                  value={theme.accent}
                  onChange={e => setTheme(prev => ({ ...prev, accent: e.target.value }))}
                  className="f__ctrl"
                />
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={theme.announceOn}
                onChange={e => setTheme(prev => ({ ...prev, announceOn: e.target.checked }))}
              />
              <span className="switch__track"></span>
              <span>Bandeau d&apos;annonce actif</span>
            </label>
            <input
              type="text"
              value={theme.announce}
              onChange={e => setTheme(prev => ({ ...prev, announce: e.target.value }))}
              className="f__ctrl"
              placeholder="Texte du bandeau"
            />
          </div>
        </div>

        <div className="ed__block" style={{ flex: 1 }}>
          <div className="ed__eyebrow">
            Sections
            <span className="ed__count">{sections.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sections.map((section, i) => (
              <div key={section.id} className="sec" style={{ border: '1px solid var(--a-line)', borderRadius: '7px', padding: '10px', background: 'var(--a-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <select
                    value={section.type}
                    onChange={e => updateSection(section.id, 'type', e.target.value)}
                    className="f__ctrl"
                    style={{ width: 'auto', minWidth: '120px', fontSize: '12px', padding: '4px 8px', minHeight: '30px' }}
                  >
                    {SECTION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={e => updateSection(section.id, 'title', e.target.value)}
                      className="f__ctrl"
                      style={{ fontSize: '13px', padding: '4px 8px', minHeight: '30px', marginBottom: '4px' }}
                      placeholder="Titre"
                    />
                    <input
                      type="text"
                      value={section.subtitle || ''}
                      onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                      className="f__ctrl"
                      style={{ fontSize: '12px', padding: '4px 8px', minHeight: '28px' }}
                      placeholder="Sous-titre"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '2px', flex: 'none' }}>
                    <button className="ibtn" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Monter">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <button className="ibtn" onClick={() => moveDown(i)} disabled={i === sections.length - 1} aria-label="Descendre">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <button className="ibtn ibtn--dz" onClick={() => removeSection(section.id)} aria-label="Supprimer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="b b--default b--block" style={{ marginTop: '10px' }} onClick={addSection}>
            + Ajouter une section
          </button>
        </div>

        <div className="card__foot" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="b b--primary b--block">Enregistrer et publier</button>
          <button className="b b--default b--block">Rétablir le thème d&apos;origine</button>
        </div>
      </div>

      {/* Panneau droit — Aperçu live */}
      <div className="ed__preview">
        <div className="ed__bar">
          <div className="vp-group" role="group" aria-label="Largeur d'aperçu">
            <button
              type="button"
              aria-pressed={viewport === 'desktop'}
              onClick={() => setViewport('desktop')}
            >Ordinateur</button>
            <button
              type="button"
              aria-pressed={viewport === 'tablet'}
              onClick={() => setViewport('tablet')}
            >Tablette</button>
            <button
              type="button"
              aria-pressed={viewport === 'mobile'}
              onClick={() => setViewport('mobile')}
            >Mobile</button>
          </div>
          <button
            className="b b--default b--sm"
            onClick={() => window.open('/', '_blank')}
          >
            Ouvrir dans un onglet
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--a-muted)' }}>À jour</span>
        </div>
        <div className="ed__frame-wrap">
          <div
            className="ed__frame"
            style={{
              width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px',
              maxWidth: '100%',
              height: '100%',
              margin: '0 auto',
              transition: 'width 0.3s ease',
              border: viewport !== 'desktop' ? '1px solid var(--a-line)' : 'none',
              borderRadius: viewport === 'mobile' ? '12px' : viewport === 'tablet' ? '8px' : '0',
            }}
          >
            <iframe
              ref={frameRef}
              src="/"
              title="Aperçu de la boutique"
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
