import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function ContactPage() {
  const [theme, menu] = await Promise.all([getTheme(), getMenu()]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Contact & Service Client</span>
        </nav>
      </div>

      <main className="wrap section--tight" style={{ paddingBottom: '96px' }}>
        <span className="eyebrow">À votre écoute</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Contact & FAQ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Formulaire de contact */}
          <div className="p-8 rounded-xl border border-[var(--line)]" style={{ background: 'var(--surface)' }}>
            <h2 className="h-display h2" style={{ marginBottom: '16px', fontSize: '24px' }}>
              Envoyez-nous un message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom et prénom"
                  className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Adresse e-mail</label>
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Sujet</label>

                <select className="w-full p-3 rounded border border-[var(--line-strong)] text-sm bg-white">
                  <option>Question sur une commande</option>
                  <option>Renseignements produits</option>
                  <option>Livraison et retours</option>
                  <option>Partenariat / Grossiste</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider mb-1">Message</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                />
              </div>

              <button type="submit" className="btn btn--primary btn--block">
                Envoyer mon message
              </button>
            </form>
          </div>

          {/* Coordonnées & Services */}
          <div className="space-y-8">
            <div className="p-6 rounded-xl border border-[var(--line)]" style={{ background: 'var(--paper-2)' }}>
              <h3 className="h-display h3" style={{ marginBottom: '12px' }}>Maison ORIXA (France)</h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                Service client basé en France, disponible du lundi au vendredi de 9h à 18h.
              </p>
              <div className="space-y-2 text-sm">
                <p>📧 <strong>E-mail :</strong> contact@orixa.fr</p>
                <p>📍 <strong>Atelier :</strong> Maison ORIXA, France</p>
                <p>⏱️ <strong>Délai de réponse :</strong> Sous 24h ouvrées</p>
              </div>
            </div>

            <div id="livraison" className="p-6 rounded-xl border border-[var(--line)]" style={{ background: 'var(--paper-2)' }}>
              <h3 className="h-display h3" style={{ marginBottom: '12px' }}>🚚 Délais & Frais de Livraison</h3>
              <p className="text-sm text-[var(--muted)] mb-3">
                Expédition rapide vers la France, la Belgique, la Suisse et toute l&apos;Europe.
              </p>
              <ul className="space-y-2 text-xs text-[var(--ink-2)]">
                <li>• <strong>Mondial Relay :</strong> 3 à 5 jours ouvrés (Livraison OFFERTE dès 80 €).</li>
                <li>• <strong>Colissimo Domicile :</strong> 48h à 72h ouvrées avec numéro de suivi.</li>
              </ul>
            </div>

            <div id="retours" className="p-6 rounded-xl border border-[var(--line)]" style={{ background: 'var(--paper-2)' }}>
              <h3 className="h-display h3" style={{ marginBottom: '12px' }}>🔄 Retours & Satisfait ou Remboursé</h3>
              <p className="text-sm text-[var(--muted)]">
                Vous disposez de 14 jours de rétractation à compter de la réception de votre commande pour renvoyer les cosmétiques non ouverts dans leur emballage d&apos;origine.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="mt-16 border-t border-[var(--line)] pt-12">
          <span className="eyebrow mb-2">Foire aux questions</span>
          <h2 className="h-display h2 mb-8">Questions Fréquentes</h2>

          <div className="space-y-4 max-w-3xl">
            <details className="faq group p-4 border border-[var(--line)] rounded-lg bg-white">
              <summary className="faq__q font-semibold text-base cursor-pointer">
                Comment conserver le beurre de karité brut ORIXA ?
              </summary>
              <div className="faq__a pt-2 text-sm text-[var(--muted)]">
                Le beurre de karité pur se conserve à température ambiante, à l&apos;abri de la chaleur directe et de la lumière. Il garde toutes ses propriétés hydratantes pendant plus de 24 mois.
              </div>
            </details>

            <details className="faq group p-4 border border-[var(--line)] rounded-lg bg-white">
              <summary className="faq__q font-semibold text-base cursor-pointer">
                Les denrées alimentaires (gari, gombo, hibiscus) sont-elles certifiées ?
              </summary>
              <div className="faq__a pt-2 text-sm text-[var(--muted)]">
                Oui, toutes nos denrées alimentaires sont récoltées, précuites et emballées selon les normes d&apos;hygiène de l&apos;Union Européenne en sachet hermétique.
              </div>
            </details>

            <details className="faq group p-4 border border-[var(--line)] rounded-lg bg-white">
              <summary className="faq__q font-semibold text-base cursor-pointer">
                Proposez-vous des tarifs pour les professionnels / revendeurs ?
              </summary>
              <div className="faq__a pt-2 text-sm text-[var(--muted)]">
                Absolument. Contactez notre équipe commerciale à l&apos;adresse contact@orixa.fr avec votre numéro SIRET pour obtenir notre catalogue grossiste.
              </div>
            </details>
          </div>
        </section>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
