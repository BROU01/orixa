import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Mentions légales — ORIXA',
  description: 'Mentions légales du site ORIXA.',
};

export default function MentionsLegales() {
  return (
    <>
      <Header menu={[]} />
      <main id="main" style={{ flex: 1 }}>
        <section className="section section--tight">
          <div className="wrap" style={{ maxWidth: '720px' }}>
            <span className="eyebrow eyebrow--muted">Informations légales</span>
            <h1 className="h-display h1" style={{ marginTop: '8px' }}>Mentions légales</h1>
            <p className="lede" style={{ marginTop: '16px', marginBottom: '40px' }}>
              Dernière mise à jour : 19 août 2026
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7 }}>
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>1. Éditeur du site</h2>
                <p>
                  <strong>ORIXA</strong><br />
                  Épicerie et cosmétiques d&apos;Afrique de l&apos;Ouest<br />
                  Adresse : Bè-Kpota, Lomé, Togo<br />
                  Téléphone : +228 90 00 00 00<br />
                  E-mail : bonjour@orixa.tg
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>2. Hébergeur</h2>
                <p>
                  Ce site est hébergé par Vercel Inc.<br />
                  340 S Lemon Ave #4133<br />
                  Walnut, CA 91789, États-Unis
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>3. Propriété intellectuelle</h2>
                <p>
                  L&apos;ensemble du contenu de ce site (textes, images, vidéos, graphismes, logos, marques) est la propriété exclusive d&apos;ORIXA ou de ses partenaires. Toute reproduction, représentation, modification ou adaptation, totale ou partielle, est interdite sans autorisation préalable écrite.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>4. Données personnelles</h2>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi togolaise sur la protection des données personnelles, vous disposez de droits sur vos données. Pour toute demande, contactez-nous à bonjour@orixa.tg.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Pour plus d&apos;informations, consultez notre{' '}
                  <a href="/confidentialite" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                    politique de confidentialité
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>5. Cookies</h2>
                <p>
                  Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. Vous pouvez gérer vos préférences à tout moment via notre bannière de cookies ou en consultant notre{' '}
                  <a href="/cookies" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                    politique de cookies
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>6. Contact</h2>
                <p>
                  Pour toute question relative aux mentions légales, contactez-nous via notre{' '}
                  <a href="/contact" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                    page de contact
                  </a>.
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
