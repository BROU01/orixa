import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Conditions générales de vente — ORIXA',
  description: 'Conditions générales de vente du site ORIXA.',
};

export default function CGV() {
  return (
    <>
      <Header menu={[]} />
      <main id="main" style={{ flex: 1 }}>
        <section className="section section--tight">
          <div className="wrap" style={{ maxWidth: '720px' }}>
            <span className="eyebrow eyebrow--muted">Conditions de vente</span>
            <h1 className="h-display h1" style={{ marginTop: '8px' }}>Conditions générales de vente</h1>
            <p className="lede" style={{ marginTop: '16px', marginBottom: '40px' }}>
              Dernière mise à jour : 19 août 2026
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7 }}>
              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 1 — Objet</h2>
                <p>
                  Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre ORIXA et tout client effectuant un achat sur le site orixa.tg.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 2 — Produits</h2>
                <p>
                  Les produits proposés à la vente sont ceux figurant sur le site orixa.tg. Chaque produit est présenté avec une description détaillée incluant ses caractéristiques essentielles. Les photographies des produits sont aussi fidèles que possible mais ne sauraient garantir une similitude parfaite avec le produit réel.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 3 — Prix</h2>
                <p>
                  Les prix sont indiqués en FCFA (franc CFA) toutes taxes comprises. ORIXA se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la validation de la commande.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 4 — Commande</h2>
                <p>
                  La commande est validée lorsque le client a rempli toutes les informations requises, a vérifié le contenu de son panier et a confirmé le paiement. Un e-mail de confirmation est envoyé à l&apos;adresse e-mail renseignée.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 5 — Paiement</h2>
                <p>Le paiement peut être effectué par :</p>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'disc' }}>
                  <li>T-Money</li>
                  <li>Flooz</li>
                  <li>Carte bancaire</li>
                  <li>Espèces à la livraison</li>
                </ul>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 6 — Livraison</h2>
                <p>
                  <strong>Lomé :</strong> 24 à 48h — 1 500 FCFA (offerte dès 25 000 FCFA)<br />
                  <strong>Intérieur du pays :</strong> 3 à 5 jours — 3 000 FCFA<br />
                  <strong>Retrait boutique :</strong> Gratuit — Bè-Kpota, Lomé
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 7 — Droit de rétractation & retours</h2>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Cosmétiques non ouverts :</strong> Vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation. Le produit doit être retourné dans son emballage d&apos;origine, non ouvert et en parfait état.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Cosmétiques ouverts (scellé d&apos;hygiène rompu) :</strong> Conformément à l&apos;article L.221-28 du Code de la consommation, les produits dont le scellé d&apos;hygiène a été ouvert après livraison ne peuvent être ni repris ni échangés.
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Denrées périssables :</strong> Les denrées alimentaires et produits périssables (gari, hibiscus, gombo, igname, épices, etc.) ne peuvent en aucun cas être ni repris ni échangés, conformément à la réglementation en vigueur. Ce type de produit est exclu du droit de rétractation.
                </p>
                <p>
                  En cas de défaut à la réception (produit endommagé, emballage défectueux), merci de contacter notre service client sous 24 heures avec des photos.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 8 — Remboursement</h2>
                <p>
                  Le remboursement est effectué sous 7 jours ouvrés après réception du produit retourné ou du signalement validé.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 9 — Fidélité</h2>
                <p>
                  Pour chaque commande d&apos;un montant minimum de 100 €, un bon d&apos;achat de 10 € est offert, utilisable sur votre prochaine commande.
                </p>
              </section>

              <section>
                <h2 className="h-display h3" style={{ marginBottom: '12px' }}>Article 10 — Contact</h2>
                <p>
                  Pour toute question relative aux présentes CGV, contactez-nous via notre{' '}
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
