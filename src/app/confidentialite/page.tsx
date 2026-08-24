import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de confidentialité — MAISON LA GRACE',
  description: 'Politique de confidentialité et protection des données personnelles MAISON LA GRACE. RGPD, droits, données collectées.',
  keywords: ['confidentialité MAISON LA GRACE', 'RGPD', 'données personnelles', 'protection données', 'privacy MAISON LA GRACE'],
};

export default function Confidentialite() {
  return (
    <>
      <Header menu={[]} />
      <main id="main" style={{ flex: 1 }}>
        <section className="section section--tight">
          <div className="wrap" style={{ maxWidth: '720px' }}>
            <span className="eyebrow eyebrow--muted">Protection des données</span>
            <h1 className="h-display h1" style={{ marginTop: '8px' }}>Politique de confidentialité</h1>
            <p className="lede" style={{ marginTop: '16px', marginBottom: '40px' }}>
              Dernière mise à jour : 19 août 2026
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7 }}>
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>1. Responsable du traitement</h2>
                <p>
                  Le responsable du traitement des données personnelles est :<br />
                  <strong>MAISON LA GRACE</strong> — KALIPE Constance<br />
                  23 rue Aimé Césaire, 27200 Vernon, Normandie, France<br />
                  Tél. : +33 6 6424 16 78<br />
                  Contact : maroquinerie.lagrace@gmail.com
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>2. Données collectées</h2>
                <p>Nous collectons les données suivantes dans le cadre de nos services :</p>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'disc' }}>
                  <li><strong>Données d&apos;identification</strong> : nom, prénom, adresse e-mail, numéro de téléphone</li>
                  <li><strong>Données de livraison</strong> : adresse postale, ville, code postal</li>
                  <li><strong>Données de commande</strong> : historique des achats, montant, produits</li>
                  <li><strong>Données de connexion</strong> : adresse IP, navigateur, système d&apos;exploitation</li>
                </ul>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>3. Finalités du traitement</h2>
                <p>Vos données sont traitées pour :</p>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'disc' }}>
                  <li>La gestion de vos commandes et la livraison</li>
                  <li>La création et la gestion de votre compte client</li>
                  <li>L&apos;envoi de communications commerciales (avec votre consentement)</li>
                  <li>L&apos;amélioration de nos services et de votre expérience</li>
                  <li>Le respect de nos obligations légales</li>
                </ul>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>4. Durée de conservation</h2>
                <p>
                  Vos données personnelles sont conservées pendant la durée de votre compte client, puis pendant 3 ans après la dernière connexion. Les données de commande sont conservées 5 ans pour les obligations comptables.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>5. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'disc' }}>
                  <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
                  <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
                  <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
                </ul>
                <p style={{ marginTop: '12px' }}>
                  Pour exercer vos droits, contactez-nous à maroquinerie.lagrace@gmail.com.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>6. Sécurité</h2>
                <p>
                  Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
