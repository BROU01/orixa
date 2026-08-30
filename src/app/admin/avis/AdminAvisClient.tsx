'use client';

import { useState } from 'react';
import type { ReviewRow } from '@/lib/reviews';

function Stars({ n }: { n: number }) {
  return <span style={{ color: '#D4A017', fontSize: '13px' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

interface Props {
  initialReviews: ReviewRow[];
  supabaseConfigured: boolean;
}

export default function AdminAvisClient({ initialReviews, supabaseConfigured }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [pending, setPending] = useState<string | null>(null);

  const avg = reviews.length > 0 ? (reviews.reduce((a, v) => a + v.rating, 0) / reviews.length).toFixed(1) : '—';

  const setApproved = async (id: string, approved: boolean) => {
    setPending(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      if (res.ok) setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
    } finally {
      setPending(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer définitivement cet avis ?')) return;
    setPending(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) setReviews(prev => prev.filter(r => r.id !== id));
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Avis clients</h2>
          <p className="page-sub">Note moyenne : {avg}/5 · {reviews.length} avis</p>
        </div>
      </div>

      {!supabaseConfigured && (
        <div className="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <span>La modération des avis n&apos;est pas configurée (SUPABASE_SERVICE_ROLE_KEY manquant) : les avis soumis par les clients ne sont pas enregistrés tant qu&apos;elle ne l&apos;est pas.</span>
        </div>
      )}

      <div className="card">
        {reviews.length === 0 ? (
          <div className="empty-a">Aucun avis client pour le moment.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {reviews.map((a, i) => (
              <div key={a.id} style={{ padding: '16px 18px', borderBottom: i < reviews.length - 1 ? '1px solid var(--a-line)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13.5px' }}>{a.author_name}</strong>
                  <Stars n={a.rating} />
                  <span className={`pill ${a.approved ? 'pill--ok' : 'pill--warn'}`}>
                    {a.approved ? 'Approuvé' : 'En attente'}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--a-muted)' }}>{fmtDate(a.created_at)}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--a-muted)', marginBottom: '4px' }}>Produit : {a.product_name}</p>
                <p style={{ fontSize: '13.5px' }}>{a.comment}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {!a.approved && (
                    <button className="b b--primary b--sm" disabled={pending === a.id} onClick={() => setApproved(a.id, true)}>Approuver</button>
                  )}
                  {a.approved && (
                    <button className="b b--default b--sm" disabled={pending === a.id} onClick={() => setApproved(a.id, false)}>Masquer</button>
                  )}
                  <button className="b b--ghost b--sm" style={{ color: 'var(--a-danger)' }} disabled={pending === a.id} onClick={() => remove(a.id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
