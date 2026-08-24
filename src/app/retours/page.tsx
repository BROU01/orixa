import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de retours — MAISON LA GRACE',
  description: 'Conditions et modalités de retour et de remboursement pour les commandes MAISON LA GRACE. Droit de rétractation 14 jours, retours cosmétiques, denrées périssables.',
  keywords: ['retour MAISON LA GRACE', 'politique de retour', 'remboursement', 'rétractation 14 jours', 'retour cosmétique', 'échange produit'],
};

/**
 * Page dédiée — Politique de retours & rétractation.
 * Contenu complet sur les retours, sans rediriger vers /contact.
 */
export default function RetoursPage() {
  return (
    <>
      <Header menu={[]} />
      <main id="main" style={{ flex: 1 }}>
        <section className="section section--tight">
          <div className="wrap" style={{ maxWidth: '720px' }}>
            <span className="eyebrow eyebrow--muted">Service client</span>
            <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '12px' }}>
              Politique de retours
            </h1>
            <p className="lede" style={{ marginTop: '0', marginBottom: '48px' }}>
              Nous voulons que vous soyez entièrement satisfait. Voici comment retourner un article.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7 }}>

              {/* Résumé rapide */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--s5)',
              }}>
                <h2 className="h-display h3" style={{ marginBottom: '16px' }}>En résumé</h2>
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  <div className="spec__row" style={{ fontSize: '13px' }}>
                    <span className="spec__key">Cosmétiques non ouverts</span>
                    <span className="spec__val">Retour possible sous 14 jours</span>
                  </div>
                  <div className="spec__row" style={{ fontSize: '13px' }}>
                    <span className="spec__key">Cosmétiques ouverts</span>
                    <span className="spec__val">Non repris (scellé d&apos;hygiène)</span>
                  </div>
                  <div className="spec__row" style={{ fontSize: '13px' }}>
                    <span className="spec__key">Denrées périssables</span>
                    <span className="spec__val">Non reprises</span>
                  </div>
                  <div className="spec__row" style={{ fontSize: '13px' }}>
                    <span className="spec__key">Défaut à la réception</span>
                    <span className="spec__val">Signalement sous 24 h</span>
                  </div>
                  <div className="spec__row" style={{ fontSize: '13px' }}>
                    <span className="spec__key">Remboursement</span>
                    <span className="spec__val">Sous 7 jours ouvrés</span>
                  </div>
                </div>
              </div>

              {/* Droit de rétractation */}
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Droit de rétractation — 14 jours
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  Conformément à l&apos;article L.221-18 du Code de la consommation, vous disposez d&apos;un délai de <strong>14 jours</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à motiver votre décision.
                </p>
                <p>
                  Le produit doit être retourné dans son <strong>emballage d&apos;origine, non ouvert et en parfait état</strong>. L&apos;emballage d&apos;origine doit être intact, avec le scellé d&apos;hygiène conservé. Nous nous réservons le droit de refuser un retour si le produit ne respecte pas ces conditions.
                </p>
              </section>

              {/* Cosmétiques ouverts */}
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Cosmétiques ouverts — Scellé d&apos;hygiène
                </h2>
                <p>
                  Conformément à l&apos;article L.221-28 du Code de la consommation, les produits dont le <strong>scellé d&apos;hygiène a été ouvert après livraison</strong> ne peuvent être ni repris ni échangés. Ce type de produit est exclu du droit de rétractation. Veuillez vérifier soigneusement votre commande avant d&apos;ouvrir les emballages.
                </p>
              </section>

              {/* Denrées périssables */}
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Denrées périssables &amp; produits frais
                </h2>
                <p>
                  Les denrées alimentaires et produits périssables (gari, hibiscus, gombo, igname, épices, etc.) ne peuvent en aucun cas être ni repris ni échangés, conformément à la réglementation en vigueur. Ce type de produit est exclu du droit de rétractation pour des raisons d&apos;hygiène et de sécurité alimentaire.
                </p>
              </section>

              {/* Défaut à la réception */}
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Défaut à la réception
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  En cas de défaut constaté à la réception (produit endommagé, emballage défectueux, produit non conforme à la commande), merci de contacter notre service client <strong>sous 24 heures</strong> en joignant des photos du produit et de l&apos;emballage.
                </p>
                <p>
                  Nous traiterons votre demande dans les meilleurs délais et vous proposerons un remplacement ou un remboursement selon la situation.
                </p>
              </section>

              {/* Comment effectuer un retour */}
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Comment effectuer un retour ?
                </h2>
                <ol style={{ marginTop: '8px', paddingLeft: '20px', listStyleType: 'decimal', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>
                    <strong>Contactez-nous</strong> via notre{' '}
                    <a href="/contact" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
                      page de contact
                    </a>{' '}
                    en indiquant votre numéro de commande et le motif du retour.
                  </li>
                  <li>
                    <strong>Préparez le colis</strong> : remettez le produit dans son emballage d&apos;origine, avec le scellé intact si applicable.
                  </li>
                  <li>
                    <strong>Renvoyez le colis</strong> : nous vous communiquerons l&apos;adresse de retour et les instructions d&apos;expédition. Les frais de retour sont à la charge du client, sauf en cas de défaut de notre part.
                  </li>
                  <li>
                    <strong>Remboursement</strong> : nous procéderons au remboursement sous 7 jours ouvrés après réception et vérification du produit retourné.
                  </li>
                </ol>
              </section>

              {/* Remboursement */}
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Délai de remboursement
                </h2>
                <p>
                  Le remboursement est effectué <strong>sous 7 jours ouvrés</strong> après réception du produit retourné ou du signalement validé. Le remboursement s&apos;effectue par le même moyen de paiement que celui utilisé lors de la commande initiale, sauf accord contraire.
                </p>
              </section>

              {/* Contact */}
              <section style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--s5)',
              }}>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>
                  Une question sur un retour ?
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  Notre équipe est disponible du lundi au vendredi, de 9 h à 18 h.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <p><strong>E-mail :</strong> maroquinerie.lagrace@gmail.com</p>
                  <p><strong>Tél. :</strong> +33 6 6424 16 78</p>
                  <p><strong>Atelier :</strong> 23 rue Aimé Césaire, 27200 Vernon, Normandie, France</p>
                  <p><strong>Délai de réponse :</strong> Sous 24h ouvrées</p>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a href="/contact" className="btn btn--primary">
                    Contacter le service client
                  </a>
                </div>
              </section>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
