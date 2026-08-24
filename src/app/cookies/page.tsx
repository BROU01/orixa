import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de cookies — MAISON LA GRACE',
  description: 'Politique de cookies du site MAISON LA GRACE. Cookies essentiels, préférence, analytiques.',
  keywords: ['cookies MAISON LA GRACE', 'politique cookies', 'traceurs', 'RGPD cookies'],
  openGraph: {
    title: 'Politique de cookies — MAISON LA GRACE',
    description: 'Cookies essentiels, préférence et analytiques sur MAISON LA GRACE.',
    url: 'https://maisonlagrace.fr/cookies',
    siteName: 'MAISON LA GRACE',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: { canonical: 'https://maisonlagrace.fr/cookies' },
};

export default function Cookies() {
  return (
    <>
      <Header menu={[]} />
      <main id="main" style={{ flex: 1 }}>
        <section className="section section--tight">
          <div className="wrap" style={{ maxWidth: '720px' }}>
            <span className="eyebrow eyebrow--muted">Cookies & traceurs</span>
            <h1 className="h-display h1" style={{ marginTop: '8px' }}>Politique de cookies</h1>
            <p className="lede" style={{ marginTop: '16px', marginBottom: '40px' }}>
              Dernière mise à jour : 19 août 2026
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7 }}>
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Qu&apos;est-ce qu&apos;un cookie ?</h2>
                <p>
                  Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, smartphone) lors de la consultation d&apos;un site web. Il permet au site de mémoriser vos actions et préférences pendant une durée déterminée.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Cookies utilisés</h2>
                
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>Cookies essentiels</h3>
                  <p>
                    Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.
                  </p>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'disc' }}>
                    <li><strong>session</strong> — Gestion de votre session de navigation</li>
                    <li><strong>cart</strong> — Mémorisation de votre panier d&apos;achat</li>
                    <li><strong>csrf</strong> — Protection contre les attaques CSRF</li>
                  </ul>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>Cookies de préférence</h3>
                  <p>
                    Ces cookies mémorisent vos choix (langue, devise, affichage) pour personnaliser votre expérience.
                  </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>Cookies analytiques</h3>
                  <p>
                    Ces cookies nous aident à comprendre comment vous utilisez le site afin d&apos;améliorer nos services. Ils sont anonymisés.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Gestion de vos préférences</h2>
                <p>
                  Vous pouvez à tout moment modifier vos préférences en matière de cookies en cliquant sur le bouton ci-dessous ou en accédant aux paramètres de votre navigateur.
                </p>
                <p style={{ marginTop: '12px' }}>
                  <strong>Note :</strong> La désactivation de certains cookies peut affecter votre expérience de navigation.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Contact</h2>
                <p>
                  Pour toute question relative à notre politique de cookies, contactez-nous à maroquinerie.lagrace@gmail.com.
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
