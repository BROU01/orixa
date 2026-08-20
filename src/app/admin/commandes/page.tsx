/**
 * Page admin — Gestion des commandes.
 * Données de démonstration statiques (pas de backend réel pour les commandes).
 */
const DEMO_ORDERS = [
  { id: 'ORX-2418', date: '30 juil. 2026', client: 'Camille Durand', ville: 'Paris', total: 184.00, paiement: 'Stripe', statut: 'Payée' },
  { id: 'ORX-2417', date: '30 juil. 2026', client: 'Nicolas Lefèvre', ville: 'Lyon', total: 72.00, paiement: 'PayPal', statut: 'À préparer' },
  { id: 'ORX-2416', date: '29 juil. 2026', client: 'Awa Diallo', ville: 'Bordeaux', total: 312.00, paiement: 'Wero', statut: 'Expédiée' },
  { id: 'ORX-2415', date: '29 juil. 2026', client: 'Hugo Bernard', ville: 'Nantes', total: 53.00, paiement: 'Virement', statut: 'Paiement refusé' },
  { id: 'ORX-2414', date: '28 juil. 2026', client: 'Sofia Rossi', ville: 'Marseille', total: 127.50, paiement: 'Stripe', statut: 'Livrée' },
];

function getStatutPill(statut: string): string {
  switch (statut) {
    case 'Payée':
    case 'Expédiée':
    case 'Livrée':
      return 'pill--ok';
    case 'À préparer':
      return 'pill--warn';
    case 'Paiement refusé':
    case 'Annulée':
      return 'pill--danger';
    default:
      return 'pill--neutral';
  }
}

export default function AdminCommandesPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
            Commandes
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {DEMO_ORDERS.length} commandes
          </p>
        </div>
        <button className="btn btn--secondary btn--sm">
          Exporter CSV
        </button>
      </div>

      {/* Note */}
      <div
        className="mb-6 p-4 rounded-xl text-sm flex items-start gap-3"
        style={{
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.3)',
        }}
      >
        <span className="text-lg">⚠️</span>
        <p>
          Les commandes sont des données de démonstration statiques.
          En production, elles seront gérées via Supabase.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder="Rechercher par numéro ou client..."
              className="w-full px-3 py-2 text-sm border rounded-lg"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
          <select
            className="px-3 py-2 text-sm border rounded-lg"
            style={{ borderColor: 'var(--line)' }}
          >
            <option value="">Tous les statuts</option>
            <option value="payee">Payée</option>
            <option value="preparer">À préparer</option>
            <option value="expediee">Expédiée</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {/* Orders table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Commande</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Client</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Paiement</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Statut</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="p-3">
                    <p className="font-semibold">#{order.id}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{order.date}</p>
                  </td>
                  <td className="p-3">
                    <p>{order.client}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{order.ville}</p>
                  </td>
                  <td className="p-3">{order.paiement}</td>
                  <td className="p-3">
                    <span className={`pill ${getStatutPill(order.statut)}`}>
                      {order.statut}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium">{order.total.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
