/**
 * Page admin — Réglages de la boutique.
 * Paramètres généraux de la boutique.
 */
export default function AdminReglagesPage() {
  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium" style={{ fontFamily: 'var(--f-display)' }}>
          Réglages
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Configuration générale de la boutique.
        </p>
      </div>

      <div className="space-y-6">
        {/* Boutique */}
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--f-display)' }}>
            Boutique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de la boutique</label>
              <input
                type="text"
                defaultValue="ORIXA"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email support</label>
              <input
                type="email"
                defaultValue="contact@orixa.fr"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                defaultValue="+33 1 23 45 67 89"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input
                type="text"
                defaultValue="Paris, France"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
          </div>
        </div>

        {/* Livraison */}
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--f-display)' }}>
            Livraison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">France — Prix de base (€)</label>
              <input
                type="number"
                defaultValue="5.90"
                step="0.10"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Livraison gratuite à partir de (€)</label>
              <input
                type="number"
                defaultValue="80"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              />
            </div>
          </div>
        </div>

        {/* Devise */}
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--f-display)' }}>
            Devise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Devise par défaut</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-lg"
                style={{ borderColor: 'var(--line)' }}
              >
                <option value="EUR">EUR — €</option>
                <option value="USD">USD — $</option>
                <option value="GBP">GBP — £</option>
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--f-display)' }}>
            Maintenance
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <label className="switch">
              <input type="checkbox" />
              <span className="switch__track"></span>
            </label>
            <span className="text-sm font-medium">Mode maintenance</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message de maintenance</label>
            <textarea
              rows={3}
              defaultValue="Site en maintenance. Nous serons de retour très rapidement."
              className="w-full px-3 py-2 text-sm border rounded-lg"
              style={{ borderColor: 'var(--line)' }}
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <button className="btn btn--secondary">Annuler</button>
          <button className="btn btn--primary">Enregistrer les réglages</button>
        </div>
      </div>
    </div>
  );
}
