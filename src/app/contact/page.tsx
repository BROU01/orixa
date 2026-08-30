import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact & Service Client — MAISON LA GRACE',
  description:
    'Contactez MAISON LA GRACE : formulaire, e-mail, livraison, retours et FAQ. Service client du lundi au vendredi de 9h à 18h.',
  keywords: ['contact MAISON LA GRACE', 'service client', 'aide', 'livraison', 'retours'],
  openGraph: {
    title: 'Contact & Service Client — MAISON LA GRACE',
    description:
      'Formulaire de contact, e-mail, livraison, retours. Service client MAISON LA GRACE.',
    url: 'https://maisonlagrace.fr/contact',
    siteName: 'MAISON LA GRACE',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: { canonical: 'https://maisonlagrace.fr/contact' },
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

            <ContactForm />
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
                MAISON LA GRACE — Vernon, Normandie
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                Service client basé en Normandie, disponible du lundi au vendredi de 9h à 18h.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <p><strong>Adresse :</strong> 23 rue Aimé Césaire, 27200 Vernon, Normandie, France</p>
                <p><strong>Tél. :</strong> +33 6 6424 16 78</p>
                <p><strong>E-mail :</strong> maroquinerie.lagrace@gmail.com</p>
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
                Absolument. Contactez notre équipe commerciale à l&apos;adresse maroquinerie.lagrace@gmail.com avec votre numéro SIRET pour obtenir notre catalogue grossiste.
              </div>
            </details>
          </div>
        </section>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
