import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact & Service Client',
  description:
    'Contactez MAISON LA GRACE : formulaire, e-mail, livraison, retours et FAQ. Service client du lundi au vendredi de 9h à 18h.',
  keywords: ['contact MAISON LA GRACE', 'service client', 'aide', 'livraison', 'retours'],
};

/**
 * Page Contact & Service Client.
 */
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
        <span className="eyebrow">Service client</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '12px' }}>
          Contact & Service Client
        </h1>
        <p className="lede" style={{ marginBottom: '48px' }}>
          Nous répondons du lundi au vendredi, de 9 h à 18 h.
        </p>

        {/* ===== Grille 2 colonnes : Formulaire + Informations ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'var(--s8)',
          alignItems: 'start',
        }}>

          {/* --- Colonne gauche : Formulaire --- */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-md)',
            padding: 'var(--s6)',
          }}>
            <span className="eyebrow" style={{ marginBottom: '8px' }}>Formulaire</span>
            <h2 className="h-display h3" style={{ marginBottom: '24px' }}>
              Envoyez-nous un message
            </h2>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Nom complet */}
              <div>
                <label
                  htmlFor="contact-name"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '6px',
                  }}
                >
                  Nom complet
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Votre nom et prénom"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    fontSize: '14px',
                    background: 'var(--paper)',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Adresse e-mail */}
              <div>
                <label
                  htmlFor="contact-email"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '6px',
                  }}
                >
                  Adresse e-mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    fontSize: '14px',
                    background: 'var(--paper)',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--ink)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Sujet */}
              <div>
                <label
                  htmlFor="contact-subject"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '6px',
                  }}
                >
                  Sujet
                </label>
                <select
                  id="contact-subject"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px',
                    fontSize: '14px',
                    background: 'var(--paper)',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--ink)',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A7467' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                >
                  <option>Suivi de commande</option>
                  <option>Question sur un produit</option>
                  <option>Livraison et retours</option>
                  <option>Partenariat / Grossiste</option>
                  <option>Autre</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '6px',
                  }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '14px',
                    background: 'var(--paper)',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--ink)',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: '1.6',
                  }}
                />
              </div>

              <button type="submit" className="btn btn--primary btn--block">
                Envoyer le message
              </button>
            </form>
          </div>

          {/* --- Colonne droite : Informations --- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
            {/* Coordonnées */}
            <div style={{
              background: 'var(--paper-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--s5)',
            }}>
              <h3 className="h-display h3" style={{ marginBottom: '12px' }}>
                Maison MAISON LA GRACE (France)
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                Service client basé en France, disponible du lundi au vendredi de 9h à 18h.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <p><strong>E-mail :</strong> contact@maisonlagrace.fr</p>
                <p><strong>Atelier :</strong> Maison MAISON LA GRACE, France</p>
                <p><strong>Délai de réponse :</strong> Sous 24h ouvrées</p>
              </div>
            </div>

            {/* Livraison */}
            <div id="livraison" style={{
              background: 'var(--paper-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--s5)',
            }}>
              <h3 className="h-display h3" style={{ marginBottom: '12px' }}>
                Délais & Frais de Livraison
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '12px' }}>
                Expédition rapide vers la France, la Belgique, la Suisse et toute l&apos;Europe.
              </p>
              <div style={{ borderTop: '1px solid var(--line)' }}>
                <div className="spec__row" style={{ fontSize: '13px' }}>
                  <span className="spec__key">Mondial Relay</span>
                  <span className="spec__val">3 à 5 jours ouvrés — Livraison OFFERTE dès 80 €</span>
                </div>
                <div className="spec__row" style={{ fontSize: '13px' }}>
                  <span className="spec__key">Colissimo Domicile</span>
                  <span className="spec__val">48h à 72h avec numéro de suivi</span>
                </div>
              </div>
            </div>

            {/* Retours */}
            <div id="retours" style={{
              background: 'var(--paper-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--s5)',
            }}>
              <h3 className="h-display h3" style={{ marginBottom: '12px' }}>
                Retours & Satisfait ou Remboursé
              </h3>
              <div style={{ borderTop: '1px solid var(--line)' }}>
                <div className="spec__row" style={{ fontSize: '13px' }}>
                  <span className="spec__key">Produits frais</span>
                  <span className="spec__val">Signalement sous 24 h</span>
                </div>
                <div className="spec__row" style={{ fontSize: '13px' }}>
                  <span className="spec__key">Cosmétiques non ouverts</span>
                  <span className="spec__val">14 jours</span>
                </div>
                <div className="spec__row" style={{ fontSize: '13px' }}>
                  <span className="spec__key">Remboursement</span>
                  <span className="spec__val">Sous 7 jours ouvrés</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FAQ ===== */}
        <section id="faq" style={{
          marginTop: 'var(--s9)',
          paddingTop: 'var(--s7)',
          borderTop: '1px solid var(--line)',
        }}>
          <span className="eyebrow" style={{ marginBottom: '8px' }}>Questions fréquentes</span>
          <h2 className="h-display h2" style={{ marginBottom: '32px' }}>
            Vous vous demandez peut-être
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '720px' }}>
            <details className="faq">
              <summary className="faq__q">
                Puis-je payer à la livraison ?
              </summary>
              <div className="faq__a">
                Oui, en espèces auprès du livreur. Nous acceptons également les virements bancaires et les cartes bancaires en ligne.
              </div>
            </details>
            <details className="faq">
              <summary className="faq__q">
                Comment faire un retour ?
              </summary>
              <div className="faq__a">
                Produits frais : signalez le problème sous 24 h avec des photos. Cosmétiques non ouverts : 14 jours de rétractation. Remboursement sous 7 jours ouvrés.
              </div>
            </details>
            <details className="faq">
              <summary className="faq__q">
                Comment conserver le beurre de karité brut MAISON LA GRACE ?
              </summary>
              <div className="faq__a">
                Le beurre de karité pur se conserve à température ambiante, à l&apos;abri de la chaleur directe et de la lumière. Il garde toutes ses propriétés hydratantes pendant plus de 24 mois.
              </div>
            </details>
            <details className="faq">
              <summary className="faq__q">
                Les denrées alimentaires sont-elles certifiées ?
              </summary>
              <div className="faq__a">
                Oui, toutes nos denrées alimentaires sont récoltées, précuites et emballées selon les normes d&apos;hygiène en sachet hermétique.
              </div>
            </details>
            <details className="faq">
              <summary className="faq__q">
                Proposez-vous des tarifs pour les professionnels / revendeurs ?
              </summary>
              <div className="faq__a">
                Absolument. Contactez notre équipe commerciale à l&apos;adresse contact@maisonlagrace.fr avec votre numéro SIRET pour obtenir notre catalogue grossiste.
              </div>
            </details>
          </div>
        </section>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
