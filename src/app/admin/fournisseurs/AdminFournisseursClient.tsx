'use client';

import { useState, FormEvent } from 'react';
import type { SupplierRow } from '@/lib/suppliers';

interface Props {
  initialSuppliers: SupplierRow[];
  supabaseConfigured: boolean;
}

const emptyForm = { nom: '', specialite: '', contact: '', email: '', produits: '', delai: '' };

export default function AdminFournisseursClient({ initialSuppliers, supabaseConfigured }: Props) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, produits: Number(form.produits) || 0 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuppliers(prev => [
          { id: crypto.randomUUID(), created_at: new Date().toISOString(), nom: form.nom, specialite: form.specialite, contact: form.contact, email: form.email, produits: Number(form.produits) || 0, delai: form.delai, actif: true },
          ...prev,
        ]);
        setForm(emptyForm);
        setShowModal(false);
      } else {
        setError(data.error || 'Échec de l’enregistrement.');
      }
    } catch {
      setError('Échec de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Fournisseurs</h2>
          <p className="page-sub">{suppliers.length} fournisseur{suppliers.length > 1 ? 's' : ''} enregistré{suppliers.length > 1 ? 's' : ''}.</p>
        </div>
        <button className="b b--primary" onClick={() => setShowModal(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Ajouter un fournisseur
        </button>
      </div>

      {!supabaseConfigured && (
        <div className="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <span>SUPABASE_SERVICE_ROLE_KEY n&apos;est pas configuré : les fournisseurs ajoutés ne seront pas enregistrés tant qu&apos;il ne l&apos;est pas.</span>
        </div>
      )}

      <div className="card">
        {suppliers.length === 0 ? (
          <div className="empty-a">Aucun fournisseur enregistré pour le moment.</div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Fournisseur</th>
                  <th>Spécialité</th>
                  <th>Contact</th>
                  <th className="tbl__num">Produits</th>
                  <th>Délai moyen</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((f) => (
                  <tr key={f.id}>
                    <td><strong>{f.nom}</strong></td>
                    <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{f.specialite || '—'}</td>
                    <td>
                      <span style={{ fontSize: '13px' }}>{f.contact || '—'}</span>
                      {f.email && (<><br /><span style={{ fontSize: '11.5px', color: 'var(--a-muted)' }}>{f.email}</span></>)}
                    </td>
                    <td className="tbl__num">{f.produits}</td>
                    <td style={{ fontSize: '12px' }}>{f.delai || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <dialog open style={{ width: 'min(480px, 94vw)', padding: 0, border: 'none', borderRadius: 'var(--a-r)', position: 'fixed', inset: 0, zIndex: 1000 }}>
          <form onSubmit={handleSave}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--a-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Ajouter un fournisseur</h2>
              <button type="button" className="b b--ghost b--sm" onClick={() => setShowModal(false)}>Fermer</button>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="f">
                <label className="f__label" htmlFor="f-nom">Nom *</label>
                <input className="f__ctrl" id="f-nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="f-spe">Spécialité</label>
                <input className="f__ctrl" id="f-spe" value={form.specialite} onChange={e => setForm(f => ({ ...f, specialite: e.target.value }))} placeholder="Karité, gari, épices…" />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="f-contact">Contact</label>
                <input className="f__ctrl" id="f-contact" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="f-email">E-mail</label>
                <input className="f__ctrl" id="f-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="f">
                <label className="f__label" htmlFor="f-delai">Délai moyen</label>
                <input className="f__ctrl" id="f-delai" value={form.delai} onChange={e => setForm(f => ({ ...f, delai: e.target.value }))} placeholder="5-7 jours" />
              </div>
              {error && <p style={{ color: 'var(--a-danger)', fontSize: '13px' }}>{error}</p>}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--a-line)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="b b--default" onClick={() => setShowModal(false)}>Annuler</button>
              <button type="submit" className="b b--primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
