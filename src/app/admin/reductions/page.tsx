import { getDiscounts } from '@/lib/data';
import type { Discount } from '@/types';

const TYPE_LABELS: Record<string, string> = {
  pct: 'Pourcentage',
  fixe: 'Montant fixe',
  liv: 'Livraison offerte',
};

/**
 * Page admin — Gestion des codes de réduction.
 * Protégée par le middleware (server-side).
 */
export default async function AdminReductionsPage() {
  const reductions = await getDiscounts();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Réductions
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Codes promotionnels applicables au panier.
          </p>
        </div>
        <button className="btn btn--primary btn--sm">
          + Créer un code
        </button>
      </div>

      {/* Info note */}
      <div className="card p-4 mb-6" style={{ background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--accent)' }}>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Les codes sont créés et gérés ici, mais leur application au panier doit être
          validée côté serveur — une remise vérifiée uniquement dans le navigateur est contournable.
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Code</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Type</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Condition</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Utilisations</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Expire</th>
                <th className="text-center p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>État</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reductions.map((red: Discount) => (
                <tr
                  key={red.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="p-3">
                    <code className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(201,168,76,0.1)' }}>
                      {red.code}
                    </code>
                  </td>
                  <td className="p-3">{TYPE_LABELS[red.type] || red.type}</td>
                  <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {red.type === 'pct' && `${red.valeur}%`}
                    {red.type === 'fixe' && `${red.valeur.toFixed(2)} €`}
                    {red.type === 'liv' && 'Livraison gratuite'}
                    {red.min > 0 && ` · Panier ≥ ${red.min} €`}
                  </td>
                  <td className="p-3 text-right">{red.usages}</td>
                  <td className="p-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {red.fin || '—'}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`pill ${red.actif ? 'pill--ok' : 'pill--danger'}`}>
                      {red.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="btn btn--secondary btn--sm">Modifier</button>
                  </td>
                </tr>
              ))}
              {reductions.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  Aucun code de réduction.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
