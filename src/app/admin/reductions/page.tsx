'use client';

import { useState, useEffect } from 'react';
import type { Discount } from '@/types';
import { getDiscounts } from '@/lib/data';

/**
 * Page admin — Gestion des codes de réduction.
 * Fidèle au projet orixa-site-complet original.
 * CRUD complet avec modales, toggle actif/inactif.
 */
const TYPES: Record<string, string> = { pct: 'Pourcentage', fixe: 'Montant fixe', liv: 'Livraison offerte' };
const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

export default function AdminReductionsPage() {
  const [reductions, setReductions] = useState<Discount[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Code de réduction');
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState({ code: '', type: 'pct', valeur: '10', min: '', limite: '', fin: '', actif: true });

  useEffect(() => {
    getDiscounts().then(d => { setReductions(d); setLoaded(true); });
  }, []);

  const valeurTxt = (d: Discount) => {
    if (d.type === 'pct') return d.valeur + ' %';
    if (d.type === 'fixe') return fmt(d.valeur);
    return 'Frais de port';
  };

  const openNew = () => {
    setEditing(null);
    setModalTitle('Nouveau code');
    setForm({ code: '', type: 'pct', valeur: '10', min: '', limite: '', fin: '', actif: true });
    setShowModal(true);
  };

  const openEdit = (d: Discount) => {
    setEditing(d);
    setModalTitle('Modifier le code');
    setForm({ code: d.code, type: d.type, valeur: String(d.valeur), min: d.min ? String(d.min) : '', limite: d.limite ? String(d.limite) : '', fin: d.fin || '', actif: d.actif });
    setShowModal(true);
  };

  const save = () => {
    const code = form.code.trim().toUpperCase();
    if (!code) return;
    const payload: Partial<Discount> = {
      code,
      type: form.type as Discount['type'],
      valeur: parseInt(form.valeur, 10) || 0,
      min: parseInt(form.min, 10) || 0,
      limite: parseInt(form.limite, 10) || 0,
      fin: form.fin,
      actif: form.actif,
    };
    if (editing) {
      setReductions(prev => prev.map(d => d.id === editing.id ? { ...d, ...payload } : d));
    } else {
      setReductions(prev => [{ id: 'r' + Date.now(), usages: 0, ...payload } as Discount, ...prev]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => {
    if (!confirm('Supprimer ce code ?')) return;
    setReductions(prev => prev.filter(d => d.id !== id));
  };

  const toggleActif = (id: string) => {
    setReductions(prev => prev.map(d => d.id === id ? { ...d, actif: !d.actif } : d));
  };

  const hint = form.type === 'pct' ? 'En pourcentage.' : form.type === 'fixe' ? 'En euros.' : 'Sans effet pour ce type.';

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Réductions</h2>
          <p className="page-sub">Codes promotionnels applicables au panier.</p>
        </div>
        <button className="b b--primary" onClick={openNew}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Créer un code
        </button>
      </div>

      <section className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Valeur</th>
                <th>Panier minimum</th>
                <th>Expire le</th>
                <th className="tbl__num">Utilisations</th>
                <th>Actif</th>
                <th className="tbl__num">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reductions.map(d => (
                <tr key={d.id}>
                  <td><strong style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{d.code}</strong></td>
                  <td>{TYPES[d.type] || d.type}</td>
                  <td>{valeurTxt(d)}</td>
                  <td>{d.min ? fmt(d.min) : '—'}</td>
                  <td>{d.fin || '—'}</td>
                  <td className="tbl__num">{d.usages}{d.limite ? ' / ' + d.limite : ''}</td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={d.actif} onChange={() => toggleActif(d.id)} />
                      <span className="switch__track"></span>
                      <span className="visually-hidden">Activer {d.code}</span>
                    </label>
                  </td>
                  <td className="tbl__num">
                    <button className="b b--default b--sm" onClick={() => openEdit(d)}>Modifier</button>
                    {' '}
                    <button className="b b--danger b--sm" onClick={() => remove(d.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reductions.length === 0 && <div className="empty-a">Aucun code de réduction.</div>}
      </section>

      {showModal && (
        <dialog open style={{ width: 'min(560px, 94vw)', padding: 0, border: 'none', borderRadius: 'var(--a-r)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--a-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600 }}>{modalTitle}</h2>
            <button className="b b--ghost b--sm" onClick={() => setShowModal(false)}>Fermer</button>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="f">
              <label className="f__label" htmlFor="r-code">Code</label>
              <input className="f__ctrl" id="r-code" spellCheck={false} placeholder="BIENVENUE10" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
            </div>
            <div className="f-row">
              <div className="f">
                <label className="f__label" htmlFor="r-type">Type</label>
                <select className="f__ctrl" id="r-type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="pct">Pourcentage</option>
                  <option value="fixe">Montant fixe</option>
                  <option value="liv">Livraison offerte</option>
                </select>
              </div>
              <div className="f">
                <label className="f__label" htmlFor="r-val">Valeur</label>
                <input className="f__ctrl" id="r-val" type="number" min="0" value={form.valeur} onChange={e => setForm(f => ({ ...f, valeur: e.target.value }))} disabled={form.type === 'liv'} />
                <p className="f__hint">{hint}</p>
              </div>
            </div>
            <div className="f-row">
              <div className="f">
                <label className="f__label" htmlFor="r-min">Panier minimum (€)</label>
                <input className="f__ctrl" id="r-min" type="number" min="0" value={form.min} onChange={e => setForm(f => ({ ...f, min: e.target.value }))} />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="r-lim">Limite d&apos;utilisations</label>
                <input className="f__ctrl" id="r-lim" type="number" min="0" value={form.limite} onChange={e => setForm(f => ({ ...f, limite: e.target.value }))} />
                <p className="f__hint">0 = illimité.</p>
              </div>
            </div>
            <div className="f">
              <label className="f__label" htmlFor="r-fin">Date d&apos;expiration</label>
              <input className="f__ctrl" id="r-fin" type="date" value={form.fin} onChange={e => setForm(f => ({ ...f, fin: e.target.value }))} />
            </div>
            <div className="f">
              <label className="switch">
                <input type="checkbox" checked={form.actif} onChange={e => setForm(f => ({ ...f, actif: e.target.checked }))} />
                <span className="switch__track"></span>
                <span>Code actif</span>
              </label>
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
