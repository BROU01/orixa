'use client';

import { useState } from 'react';

/**
 * Page admin — Réglages de la boutique.
 * Fidèle au projet orixa-site-complet original.
 * Formulaires avec sauvegarde locale.
 */
export default function AdminReglagesPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    nom: 'MAISON LA GRACE',
    email: 'contact@maisonlagrace.fr',
    tel: '+33 1 23 45 67 89',
    adresse: 'Paris, France',
    livraisonBase: '5.90',
    livraisonGratuit: '80',
    devise: 'EUR',
    maintenance: false,
    maintenanceMsg: 'Site en maintenance. Nous serons de retour très rapidement.',
  });

  const update = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const saveSettings = () => {
    // En production, sauvegarde via API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="content" style={{ maxWidth: '900px' }}>
      <div className="page-head">
        <div>
          <h2 className="page-title">Réglages</h2>
          <p className="page-sub">Configuration générale de la boutique.</p>
        </div>
        {saved && <span className="pill pill--ok">Enregistré</span>}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card__head">
          <h3 className="card__title">Boutique</h3>
        </div>
        <div className="card__body">
          <div className="f-row">
            <div className="f">
              <label className="f__label">Nom de la boutique</label>
              <input type="text" value={settings.nom} onChange={e => update('nom', e.target.value)} className="f__ctrl" />
            </div>
            <div className="f">
              <label className="f__label">Email support</label>
              <input type="email" value={settings.email} onChange={e => update('email', e.target.value)} className="f__ctrl" />
            </div>
          </div>
          <div className="f-row">
            <div className="f">
              <label className="f__label">Téléphone</label>
              <input type="tel" value={settings.tel} onChange={e => update('tel', e.target.value)} className="f__ctrl" />
            </div>
            <div className="f">
              <label className="f__label">Adresse</label>
              <input type="text" value={settings.adresse} onChange={e => update('adresse', e.target.value)} className="f__ctrl" />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card__head">
          <h3 className="card__title">Livraison</h3>
        </div>
        <div className="card__body">
          <div className="f-row">
            <div className="f">
              <label className="f__label">France — Prix de base (€)</label>
              <input type="number" value={settings.livraisonBase} onChange={e => update('livraisonBase', e.target.value)} step="0.10" className="f__ctrl" />
            </div>
            <div className="f">
              <label className="f__label">Livraison gratuite à partir de (€)</label>
              <input type="number" value={settings.livraisonGratuit} onChange={e => update('livraisonGratuit', e.target.value)} className="f__ctrl" />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card__head">
          <h3 className="card__title">Devise</h3>
        </div>
        <div className="card__body">
          <div className="f">
            <label className="f__label">Devise par défaut</label>
            <select className="f__ctrl" style={{ maxWidth: '240px' }} value={settings.devise} onChange={e => update('devise', e.target.value)}>
              <option value="EUR">EUR — €</option>
              <option value="USD">USD — $</option>
              <option value="GBP">GBP — £</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card__head">
          <h3 className="card__title">Maintenance</h3>
        </div>
        <div className="card__body">
          <label className="switch" style={{ marginBottom: '14px' }}>
            <input type="checkbox" checked={settings.maintenance} onChange={e => update('maintenance', e.target.checked)} />
            <span className="switch__track"></span>
            <span>Mode maintenance</span>
          </label>
          <div className="f">
            <label className="f__label">Message de maintenance</label>
            <textarea
              rows={3}
              value={settings.maintenanceMsg}
              onChange={e => update('maintenanceMsg', e.target.value)}
              className="f__ctrl"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button className="b b--default" onClick={() => setSettings({
          nom: 'MAISON LA GRACE', email: 'contact@maisonlagrace.fr', tel: '+33 1 23 45 67 89',
          adresse: 'Paris, France', livraisonBase: '5.90', livraisonGratuit: '80',
          devise: 'EUR', maintenance: false,
          maintenanceMsg: 'Site en maintenance. Nous serons de retour très rapidement.',
        })}>Annuler</button>
        <button className="b b--primary" onClick={saveSettings}>Enregistrer les réglages</button>
      </div>
    </div>
  );
}
