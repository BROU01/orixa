'use client';

import { useState, useMemo } from 'react';
import type { OrderRow, OrderStatus } from '@/lib/orders';
import { ORDER_STATUSES } from '@/lib/orders';

const PILL: Record<string, string> = {
  'Payée': 'pill--ok',
  'Expédiée': 'pill--ok',
  'En attente': 'pill--warn',
  'Paiement refusé': 'pill--danger',
  'Livrée': 'pill--neutral',
  'Remboursée': 'pill--neutral',
};

const PAYMENT_LABEL: Record<string, string> = {
  card: 'Carte bancaire',
  paypal: 'PayPal',
  wero: 'Wero',
  virement: 'Virement',
};

const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

interface Props {
  initialOrders: OrderRow[];
  supabaseConfigured: boolean;
}

export default function AdminCommandesClient({ initialOrders, supabaseConfigured }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pending, setPending] = useState<string | null>(null);

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return orders.filter(o => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (q && !norm(o.id + ' ' + o.customer_name + ' ' + o.city + ' ' + (o.customer_phone || '')).includes(q)) return false;
      return true;
    });
  }, [orders, query, statusFilter]);

  const changeStatus = async (id: string, newStatus: string) => {
    const previous = orders;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setPending(id);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus as OrderStatus }),
      });
      if (!res.ok) setOrders(previous);
    } catch {
      setOrders(previous);
    } finally {
      setPending(null);
    }
  };

  const exportCSV = () => {
    const header = 'numero,date,client,ville,telephone,paiement,statut,total';
    const rows = orders.map(o => [o.id, o.created_at, o.customer_name, o.city, o.customer_phone || '', o.payment_method, o.status, o.total].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'maison-la-grace-commandes.csv';
    a.click();
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Commandes</h2>
          <p className="page-sub">Suivi, préparation et changement de statut.</p>
        </div>
        <button className="b b--default" onClick={exportCSV} disabled={orders.length === 0}>Exporter en CSV</button>
      </div>

      {!supabaseConfigured && (
        <div className="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <span>La persistance des commandes n&apos;est pas configurée (SUPABASE_SERVICE_ROLE_KEY manquant). Les commandes passées ne sont visibles que sur l&apos;appareil du client.</span>
        </div>
      )}

      <section className="card">
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="qc">Rechercher</label>
            <input className="f__ctrl" id="qc" type="search" placeholder="Numéro, client, ville ou téléphone" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <label className="visually-hidden" htmlFor="fst">Filtrer par statut</label>
          <select className="f__ctrl" id="fst" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tous les statuts</option>
            {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
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
                <tr key={o.id}>
                  <td>
                    <strong>#{o.id}</strong>
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{o.items.reduce((n, i) => n + i.qty, 0)} articles</span>
                  </td>
                  <td>{fmtDate(o.created_at)}</td>
                  <td>
                    {o.customer_name}
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{o.city}{o.customer_phone ? ` · ${o.customer_phone}` : ''}</span>
                  </td>
                  <td>{PAYMENT_LABEL[o.payment_method] || o.payment_method}</td>
                  <td>
                    <span className={'pill ' + (PILL[o.status] || 'pill--neutral')} style={{ marginBottom: '5px' }}>{o.status}</span>
                    <br />
                    <select
                      className="f__ctrl"
                      style={{ minHeight: '28px', fontSize: '12px', padding: '2px 24px 2px 8px' }}
                      value={o.status}
                      disabled={pending === o.id}
                      onChange={e => changeStatus(o.id, e.target.value)}
                      aria-label={'Statut de la commande ' + o.id}
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="tbl__num">{fmt(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-a">
            {orders.length === 0 ? 'Aucune commande enregistrée pour le moment.' : 'Aucune commande ne correspond.'}
          </div>
        )}
      </section>
    </div>
  );
}
