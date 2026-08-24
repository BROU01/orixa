import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function LegalPage() {
  const [theme, menu] = await Promise.all([getTheme(), getMenu()]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Informations Légales & CGV</span>
        </nav>
      </div>

      <main className="wrap section--tight" style={{ maxWidth: '840px', paddingBottom: '96px' }}>
        <span className="eyebrow">Transparence & Conformité</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Mentions Légales, CGV & RGPD
        </h1>

        <div className="space-y-12 text-sm text-[var(--ink-2)] leading-relaxed">
          
          {/* Mentions Légales */}
          <section id="mentions" className="p-6 rounded-xl border border-[var(--line)] bg-white">
            <h2 className="h-display h2 mb-4" style={{ fontSize: '24px' }}>1. Mentions Légales</h2>
            <p className="mb-2"><strong>Nom de la boutique :</strong> MAISON LA GRACE</p>
            <p className="mb-2"><strong>Propriétaire & Exploitant :</strong> Maison MAISON LA GRACE (Mme Kalipé G.)</p>
            <p className="mb-2"><strong>Siège social :</strong> France</p>
            <p className="mb-2"><strong>Contact :</strong> contact@maisonlagrace.fr</p>
            <p className="mb-2"><strong>Hébergeur du site :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</p>
          </section>

          {/* CGV */}
          <section id="cgv" className="p-6 rounded-xl border border-[var(--line)] bg-white">
            <h2 className="h-display h2 mb-4" style={{ fontSize: '24px' }}>2. Conditions Générales de Vente (CGV)</h2>
            <h3 className="font-bold mb-1">2.1 Produits et Prix</h3>
            <p className="mb-4">
              Les prix de nos produits sont indiqués en Euros (€) toutes taxes comprises (TTC). MAISON LA GRACE se réserve le droit de modifier ses prix à tout moment. Les produits demeurent la propriété de MAISON LA GRACE jusqu&apos;au paiement complet du prix.
            </p>

            <h3 className="font-bold mb-1">2.2 Commande et Paiement</h3>
            <p className="mb-4">
              Le paiement est exigible immédiatement à la commande. Vous pouvez effectuer votre règlement par Carte Bancaire (Visa, Mastercard), PayPal, Wero ou Virement bancaire direct.
            </p>

            <h3 className="font-bold mb-1">2.3 Droit de rétractation & Exclusions</h3>
            <p className="mb-2">
              Conformément à l&apos;article L.221-18 du Code de la consommation, vous disposez d&apos;un délai de 14 jours pour exercer votre droit de rétractation.
            </p>
            <p className="p-3 bg-amber-50 border border-amber-200 rounded text-xs">
              ⚠️ <strong>Exclusion Légale :</strong> Le droit de rétractation ne s&apos;applique pas aux denrées alimentaires scellées ou produits cosmétiques ouverts après la livraison pour des raisons d&apos;hygiène et de protection de la santé.
            </p>
          </section>

          {/* RGPD */}
          <section id="rgpd" className="p-6 rounded-xl border border-[var(--line)] bg-white">
            <h2 className="h-display h2 mb-4" style={{ fontSize: '24px' }}>3. Protection des Données Personnelles (RGPD)</h2>
            <p className="mb-3">
              MAISON LA GRACE s&apos;engage à préserver la confidentialité des informations fournies par l&apos;acheteur. Les données collectées (nom, adresse, e-mail, téléphone) sont strictement réservées au traitement et à l&apos;expédition de vos commandes.
            </p>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles sur simple demande à contact@maisonlagrace.fr.
            </p>
          </section>

          {/* Cookies */}
          <section id="cookies" className="p-6 rounded-xl border border-[var(--line)] bg-white">
            <h2 className="h-display h2 mb-4" style={{ fontSize: '24px' }}>4. Politique de Cookies</h2>
            <p>
              Le site MAISON LA GRACE utilise uniquement des cookies strictement nécessaires au fonctionnement de la boutique (gestion de la session panier, devises et favoris). Aucun cookie de traçage tiers n&apos;est revendu à des régies publicitaires.
            </p>
          </section>

        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
