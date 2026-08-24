'use client';

import { useState, useMemo } from 'react';

/**
 * Page admin — Gestion des commandes.
 * Fidèle au projet orixa-site-complet original.
 * Recherche, filtres, changement de statut, export CSV.
 */
const DEMO_ORDERS = [
  { n: 'ORX-2418', d: '30 juil. 2026', c: 'Camille Durand', q: 'Paris', tel: '06 12 34 56 78', pay: 'Stripe', st: 'Payée', items: 3, t: 184.00 },
  { n: 'ORX-2417', d: '30 juil. 2026', c: 'Nicolas Lefèvre', q: 'Lyon', tel: '06 98 76 54 32', pay: 'PayPal', st: 'À préparer', items: 1, t: 72.00 },
  { n: 'ORX-2416', d: '29 juil. 2026', c: 'Awa Diallo', q: 'Bordeaux', tel: '05 56 78 90 12', pay: 'Wero', st: 'Expédiée', items: 5, t: 312.00 },
  { n: 'ORX-2415', d: '29 juil. 2026', c: 'Hugo Bernard', q: 'Nantes', tel: '02 40 60 80 10', pay: 'Virement', st: 'Paiement refusé', items: 1, t: 53.00 },
  { n: 'ORX-2414', d: '28 juil. 2026', c: 'Sofia Rossi', q: 'Marseille', tel: '04 91 23 45 67', pay: 'Stripe', st: 'Livrée', items: 2, t: 127.50 },
];

const STATUTS = ['À préparer', 'Payée', 'Expédiée', 'Livrée', 'Paiement refusé'];
const PILL: Record<string, string> = { 'Payée': 'pill--ok', 'Expédiée': 'pill--ok', 'À préparer': 'pill--warn', 'Paiement refusé': 'pill--danger', 'Livrée': 'pill--neutral' };
const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return orders.filter(o => {
      if (statusFilter && o.st !== statusFilter) return false;
      if (q && !norm(o.n + ' ' + o.c + ' ' + o.q + ' ' + o.tel).includes(q)) return false;
      return true;
    });
  }, [orders, query, statusFilter]);

  const changeStatus = (orderNum: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.n === orderNum ? { ...o, st: newStatus } : o));
  };

  const exportCSV = () => {
    const header = 'numero,date,client,ville,telephone,paiement,statut,total';
    const rows = orders.map(o => [o.n, o.d, o.c, o.q, o.tel, o.pay, o.st, o.t].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orixa-commandes.csv';
    a.click();
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Commandes</h2>
          <p className="page-sub">Suivi, préparation et changement de statut.</p>
        </div>
        <button className="b b--default" onClick={exportCSV}>Exporter en CSV</button>
      </div>

      <section className="card">
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="qc">Rechercher</label>
            <input className="f__ctrl" id="qc" type="search" placeholder="Numéro, client, quartier ou téléphone" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <label className="visually-hidden" htmlFor="fst">Filtrer par statut</label>
          <select className="f__ctrl" id="fst" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            {STATUTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Date</th>
                <th>Client</th>
                <th>Paiement</th>
                <th>Statut</th>
                <th className="tbl__num">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.n}>
                  <td>
                    <strong>#{o.n}</strong>
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{o.items} articles</span>
                  </td>
                  <td>{o.d}</td>
                  <td>
                    {o.c}
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{o.q} · {o.tel}</span>
                  </td>
                  <td>{o.pay}</td>
                  <td>
                    <span className={'pill ' + (PILL[o.st] || 'pill--neutral')} style={{ marginBottom: '5px' }}>{o.st}</span>
                    <br />
                    <select
                      className="f__ctrl"
                      style={{ minHeight: '28px', fontSize: '12px', padding: '2px 24px 2px 8px' }}
                      value={o.st}
                      onChange={e => changeStatus(o.n, e.target.value)}
                      aria-label={'Statut de la commande ' + o.n}
                    >
                      {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="tbl__num">{fmt(o.t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-a">Aucune commande ne correspond.</div>}
      </section>
    </div>
  );
}
