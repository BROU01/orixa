'use client';

import { useState, useMemo } from 'react';
import type { CustomerSummary } from '@/lib/orders';

const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

interface Props {
  customers: CustomerSummary[];
  supabaseConfigured: boolean;
}

export default function AdminClientsClient({ customers, supabaseConfigured }: Props) {
  const [query, setQuery] = useState('');

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return customers.filter(c => !q || norm(c.name + ' ' + c.email + ' ' + c.city).includes(q));
  }, [customers, query]);

  const exportCSV = () => {
    const header = 'nom,email,ville,commandes,total,derniere_commande';
    const rows = customers.map(c => [c.name, c.email, c.city, c.orderCount, c.totalSpent, c.lastOrderAt].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'maison-la-grace-clients.csv';
    a.click();
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Clients</h2>
          <p className="page-sub">{customers.length} client{customers.length > 1 ? 's' : ''} ayant passé au moins une commande</p>
        </div>
        <button className="b b--default" onClick={exportCSV} disabled={customers.length === 0}>Exporter CSV</button>
      </div>

      {!supabaseConfigured && (
        <div className="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>La persistance des commandes n&apos;est pas configurée (SUPABASE_SERVICE_ROLE_KEY manquant) : cette liste restera vide tant qu&apos;elle ne l&apos;est pas.</span>
        </div>
      )}

      <div className="card">
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="qc">Rechercher</label>
            <input className="f__ctrl" id="qc" type="search" placeholder="Nom, email ou ville" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Ville</th>
                <th className="tbl__num">Commandes</th>
                <th className="tbl__num">Total</th>
                <th>Dernière commande</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--a-muted)', fontSize: '13px' }}>{c.email}</td>
                  <td>{c.city}</td>
                  <td className="tbl__num">{c.orderCount}</td>
                  <td className="tbl__num" style={{ fontWeight: 600 }}>{fmt(c.totalSpent)}</td>
                  <td style={{ color: 'var(--a-muted)', fontSize: '12px' }}>{fmtDate(c.lastOrderAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-a">{customers.length === 0 ? 'Aucun client pour le moment.' : 'Aucun client ne correspond.'}</div>
        )}
      </div>
    </div>
  );
}
