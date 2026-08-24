'use client';

import { useState } from 'react';

/**
 * Page admin — Notifications.
 * Alertes commandes, ruptures, paiements, nouveaux clients.
 */
const DEMO_NOTIFS = [
  { type: 'cmd', text: 'Nouvelle commande #ORX-2418 — Camille Durand — 184,00 €', time: 'il y a 12 min', read: false },
  { type: 'stock', text: 'Rupture de stock : Igname fléchée (0 unités)', time: 'il y a 1h', read: false },
  { type: 'cmd', text: 'Commande #ORX-2417 en attente de paiement — Nicolas Lefèvre', time: 'il y a 2h', read: false },
  { type: 'client', text: 'Nouveau client : Awa Diallo (awa.d@email.com)', time: 'il y a 3h', read: true },
  { type: 'stock', text: 'Stock faible : Piment oiseau (3 unités restantes)', time: 'il y a 5h', read: true },
  { type: 'cmd', text: 'Commande #ORX-2416 expédiée — Awa Diallo', time: 'hier', read: true },
];

function NotifIcon({ type }: { type: string }) {
  const cls = 'notif-ico';
  switch (type) {
    case 'cmd':
      return (
        <span className={cls} style={{ background: 'var(--a-brand)', color: '#fff' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </span>
      );
    case 'stock':
      return (
        <span className={cls} style={{ background: 'var(--a-warn)', color: '#fff' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
      );
    case 'client':
      return (
        <span className={cls} style={{ background: 'var(--a-ok)', color: '#fff' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
      );
    default:
      return (
        <span className={cls} style={{ background: 'var(--a-muted)', color: '#fff' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </span>
      );
  }
}

export default function AdminNotificationsPage() {
  const [notifs, setNotifs] = useState(DEMO_NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-sub">{unread} non lue{unread > 1 ? 's' : ''}</p>
        </div>
        <button className="b b--default" onClick={markAllRead}>Tout marquer comme lu</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {notifs.map((n, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 18px',
                borderBottom: i < notifs.length - 1 ? '1px solid var(--a-line)' : 'none',
                background: n.read ? 'transparent' : 'rgba(26,77,62,.03)',
              }}
            >
              <NotifIcon type={n.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13.5px', fontWeight: n.read ? 400 : 600 }}>{n.text}</p>
                <p style={{ fontSize: '11.5px', color: 'var(--a-muted)', marginTop: '2px' }}>{n.time}</p>
              </div>
              {!n.read && (
                <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--a-brand)', flex: 'none', marginTop: '6px' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
