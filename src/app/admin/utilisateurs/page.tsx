'use client';

import { useState, useMemo, useEffect } from 'react';
import type { AdminUser, AdminRole } from '@/types';
import { getUsers, getRoles } from '@/lib/data';

/**
 * Page admin — Gestion des utilisateurs et rôles.
 * Fidèle au projet orixa-site-complet original.
 */
export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    Promise.all([getUsers(), getRoles()]).then(([u, r]) => {
      setUsers(u);
      setRoles(r);
      setLoaded(true);
    });
  }, []);

  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    return users.filter(u => !q || norm(u.nom + ' ' + u.email).includes(q));
  }, [users, query]);

  const roleLabel = (roleId: string) => roles.find(r => r.id === roleId)?.label || roleId;

  if (!loaded) return <div className="content"><p className="page-sub">Chargement…</p></div>;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Utilisateurs</h2>
          <p className="page-sub">Qui accède au back-office et avec quels droits.</p>
        </div>
        <button className="b b--primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Inviter un utilisateur
        </button>
      </div>

      <div className="note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          Les rôles décrits ici sont un modèle de permissions. Ils doivent être appliqués
          côté serveur : masquer un écran dans le navigateur ne protège rien.
        </span>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="toolbar">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <label className="visually-hidden" htmlFor="qu">Rechercher</label>
            <input className="f__ctrl" id="qu" type="search" placeholder="Nom ou email" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Comptes</h3>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Dernière visite</th>
                  <th style={{ textAlign: 'center' }}>État</th>
                  <th className="tbl__num">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.nom}</strong>
                      <br />
                      <span style={{ fontSize: '12px', color: 'var(--a-muted)' }}>{user.email}</span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{roleLabel(user.role)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--a-muted)' }}>
                      {user.derniereVisite || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={'pill ' + (user.actif ? 'pill--ok' : 'pill--danger')}>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="tbl__num">
                      <button className="b b--default b--sm">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Rôles disponibles</h3>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roles.map(role => (
              <div key={role.id} style={{ padding: '12px', borderRadius: '8px', background: 'var(--a-bg)' }}>
                <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{role.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {role.permissions.map((perm, i) => (
                    <span key={i} className="pill pill--ok" style={{ fontSize: '11px' }}>{perm}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
