import { getUsers, getRoles } from '@/lib/data';
import type { AdminUser, AdminRole } from '@/types';

/**
 * Page admin — Gestion des utilisateurs et rôles.
 * Protégée par le middleware (server-side).
 */
export default async function AdminUtilisateursPage() {
  const [users, roles] = await Promise.all([
    getUsers(),
    getRoles(),
  ]);

  const getRoleLabel = (roleId: string): string => {
    const role = roles.find((r: AdminRole) => r.id === roleId);
    return role ? role.label : roleId;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Utilisateurs
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Qui accède au back-office et avec quels droits.
          </p>
        </div>
        <button className="btn btn--primary btn--sm">
          + Inviter un utilisateur
        </button>
      </div>

      {/* Info note */}
      <div className="card p-4 mb-6" style={{ background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Les rôles décrits ici sont un modèle de permissions. Ils doivent être appliqués
          côté serveur : masquer un écran dans le navigateur ne protège rien.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Users table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-semibold text-sm">Comptes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Utilisateur</th>
                  <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Rôle</th>
                  <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Dernière visite</th>
                  <th className="text-center p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>État</th>
                  <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: AdminUser) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: '1px solid var(--line)' }}
                  >
                    <td className="p-3">
                      <p className="font-medium">{user.nom}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
                    </td>
                    <td className="p-3 text-xs">{getRoleLabel(user.role)}</td>
                    <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                      {user.derniereVisite || '—'}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`pill ${user.actif ? 'pill--ok' : 'pill--danger'}`}>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="btn btn--secondary btn--sm">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roles */}
        <div className="card">
          <div className="p-4 border-b" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-semibold text-sm">Rôles disponibles</h2>
          </div>
          <div className="p-4 space-y-4">
            {roles.map((role: AdminRole) => (
              <div key={role.id} className="p-3 rounded-lg" style={{ background: 'var(--bg)' }}>
                <p className="font-medium text-sm mb-1">{role.label}</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((perm, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--accent)' }}>
                      {perm}
                    </span>
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
