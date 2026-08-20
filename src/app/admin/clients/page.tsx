/**
 * Page admin — Gestion des clients.
 * Données de démonstration statiques.
 */
const DEMO_CLIENTS = [
  { nom: 'Camille Durand', email: 'camille.d@email.com', ville: 'Paris', commandes: 12, total: 1840.00, derniere: '30 juil. 2026' },
  { nom: 'Nicolas Lefèvre', email: 'nicolas.l@email.com', ville: 'Lyon', commandes: 8, total: 920.00, derniere: '30 juil. 2026' },
  { nom: 'Awa Diallo', email: 'awa.d@email.com', ville: 'Bordeaux', commandes: 15, total: 2340.00, derniere: '29 juil. 2026' },
  { nom: 'Hugo Bernard', email: 'hugo.b@email.com', ville: 'Nantes', commandes: 3, total: 285.00, derniere: '29 juil. 2026' },
  { nom: 'Sofia Rossi', email: 'sofia.r@email.com', ville: 'Marseille', commandes: 7, total: 1120.00, derniere: '28 juil. 2026' },
];

export default function AdminClientsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>Clients</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{DEMO_CLIENTS.length} clients</p>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl text-sm flex items-start gap-3"
        style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <span className="text-lg">⚠️</span>
        <p>Les données clients sont des données de démonstration statiques.</p>
      </div>

      <div className="card p-4 mb-6">
        <input type="search" placeholder="Rechercher par nom ou email..."
          className="w-full px-3 py-2 text-sm border rounded-lg" style={{ borderColor: 'var(--line)' }} />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Client</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Email</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Ville</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Commandes</th>
                <th className="text-right p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Total</th>
                <th className="text-left p-3 font-semibold text-xs uppercase" style={{ color: 'var(--muted)' }}>Dernière visite</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CLIENTS.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid var(--line)' }}>
                  <td className="p-3 font-medium">{c.nom}</td>
                  <td className="p-3" style={{ color: 'var(--muted)' }}>{c.email}</td>
                  <td className="p-3">{c.ville}</td>
                  <td className="p-3 text-right">{c.commandes}</td>
                  <td className="p-3 text-right font-medium">{c.total.toFixed(2)} €</td>
                  <td className="p-3" style={{ color: 'var(--muted)' }}>{c.derniere}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
