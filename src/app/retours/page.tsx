import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function RetoursPage() {
  const [theme, menu] = await Promise.all([getTheme(), getMenu()]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Retours & remboursements</span>
        </nav>
      </div>

      <main id="main" className="wrap section--tight" style={{ maxWidth: '800px', paddingBottom: '96px' }}>
        <span className="eyebrow">Politique de retour</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Retours & remboursements
        </h1>

        <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--ink-2)' }}>
          <p style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '24px' }}>
            Nous souhaitons que vous soyez entièrement satisfait de votre achat. Si ce n&apos;est pas le cas, voici les conditions de retour applicables.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Cosmétiques non ouverts
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Vous disposez de <strong>14 jours</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation. Le produit doit être retourné dans son emballage d&apos;origine, non ouvert et en parfait état.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Cosmétiques ouverts (scellé d&apos;hygiène rompu)
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Conformément à l&apos;article L.221-28 du Code de la consommation, les produits cosmétiques dont le <strong>scellé d&apos;hygiène a été ouvert après livraison</strong> ne peuvent être ni repris ni échangés.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Denrées périssables
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Les denrées alimentaires et produits périssables (gari, hibiscus, gombo, igname, épices, etc.) <strong>ne peuvent en aucun cas être ni repris ni échangés</strong>, conformément à la réglementation en vigueur. Ce type de produit est exclu du droit de rétractation.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Si vous constatez un défaut à la réception (produit endommagé, emballage défectueux), merci de nous contacter sous <strong>24 heures</strong> avec des photos pour que nous puissions traiter votre demande.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Procédure de retour
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '20px', listStyle: 'decimal' }}>
            <li style={{ marginBottom: '8px' }}>Contactez notre service client via la <a href="/contact" style={{ color: 'var(--brand-hover)', textDecoration: 'underline' }}>page de contact</a>.</li>
            <li style={{ marginBottom: '8px' }}>Indiquez votre numéro de commande et le motif du retour.</li>
            <li style={{ marginBottom: '8px' }}>Nous vous confirmerons l&apos;éligibilité du retour et vous enverrons les instructions.</li>
            <li style={{ marginBottom: '8px' }}>Expédiez le produit à l&apos;adresse indiquée, dans son emballage d&apos;origine.</li>
          </ol>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Délai de remboursement
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Le remboursement est effectué sous <strong>7 jours ouvrés</strong> après réception et vérification du produit retourné. Le remboursement s&apos;effectue par le même moyen de paiement que celui utilisé lors de l&apos;achat.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Frais de retour
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou d&apos;erreur de notre part.
          </p>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
