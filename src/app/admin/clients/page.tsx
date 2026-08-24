'use client';

import { useState, useMemo } from 'react';

/**
 * Page admin — Gestion des clients.
 * Fidèle au projet orixa-site-complet original.
 * Recherche, affichage, export CSV.
 */
const DEMO_CLIENTS = [
  { nom: 'Camille Durand', email: 'camille.d@email.com', ville: 'Paris', commandes: 12, total: 1840.00, derniere: '30 juil. 2026' },
  { nom: 'Nicolas Lefèvre', email: 'nicolas.l@email.com', ville: 'Lyon', commandes: 8, total: 920.00, derniere: '30 juil. 2026' },
  { nom: 'Awa Diallo', email: 'awa.d@email.com', ville: 'Bordeaux', commandes: 15, total: 2340.00, derniere: '29 juil. 2026' },
  { nom: 'Hugo Bernard', email: 'hugo.b@email.com', ville: 'Nantes', commandes: 3, total: 285.00, derniere: '29 juil. 2026' },
  { nom: 'Sofia Rossi', email: 'sofia.r@email.com', ville: 'Marseille', commandes: 7, total: 1120.00, derniere: '28 juil. 2026' },
];

const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

export default function AdminClientsPage() {
  const [query, setQuery] = useState('');

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return DEMO_CLIENTS.filter(c => !q || norm(c.nom + ' ' + c.email + ' ' + c.ville).includes(q));
  }, [query]);

  const exportCSV = () => {
    const header = 'nom,email,ville,commandes,total,derniere_visite';
    const rows = DEMO_CLIENTS.map(c => [c.nom, c.email, c.ville, c.commandes, c.total, c.derniere].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orixa-clients.csv';
    a.click();
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Clients</h2>
          <p className="page-sub">{DEMO_CLIENTS.length} clients</p>
        </div>
        <button className="b b--default" onClick={exportCSV}>Exporter CSV</button>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Les données clients sont des données de démonstration statiques.</span>
      </div>

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
                <th>Dernière visite</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.nom}</td>
                  <td style={{ color: 'var(--a-muted)', fontSize: '13px' }}>{c.email}</td>
                  <td>{c.ville}</td>
                  <td className="tbl__num">{c.commandes}</td>
                  <td className="tbl__num" style={{ fontWeight: 600 }}>{fmt(c.total)}</td>
                  <td style={{ color: 'var(--a-muted)', fontSize: '12px' }}>{c.derniere}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-a">Aucun client ne correspond.</div>}
      </div>
    </div>
  );
}
