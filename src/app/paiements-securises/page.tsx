import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function PaiementsSecurisesPage() {
  const [theme, menu] = await Promise.all([getTheme(), getMenu()]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Paiements sécurisés</span>
        </nav>
      </div>

      <main id="main" className="wrap section--tight" style={{ maxWidth: '800px', paddingBottom: '96px' }}>
        <span className="eyebrow">Sécurité</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Paiements sécurisés
        </h1>

        <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--ink-2)' }}>
          <p style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '24px' }}>
            Toutes les transactions sur MAISON LA GRACE sont protégées par un cryptage SSL/TLS 256 bits. Vos données bancaires ne sont jamais stockées sur nos serveurs.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Moyens de paiement acceptés
          </h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Carte bancaire (Visa, Mastercard) via Stripe</li>
            <li>PayPal</li>
            <li>Virement bancaire</li>
          </ul>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Comment ça fonctionne
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Lors du paiement, vous êtes redirigé vers une page sécurisée gérée par notre prestataire de paiement. Votre carte est débitée uniquement à la confirmation de la commande.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Protection des données
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Conformément au RGPD, nous ne collectons que les données strictement nécessaires au traitement de votre commande. Aucune information bancaire n&apos;est conservée.
          </p>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
