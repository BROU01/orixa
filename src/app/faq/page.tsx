import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Questions fréquentes — MAISON LA GRACE',
  description: 'FAQ MAISON LA GRACE — Retrouvez les réponses à vos questions sur la livraison, les retours, le paiement, la fidélité et plus encore.',
  keywords: ['FAQ MAISON LA GRACE', 'questions fréquentes', 'aide livraison', 'aide commande', 'fidélité MAISON LA GRACE', 'paiement sécurisé'],
  openGraph: {
    title: 'Questions fréquentes — MAISON LA GRACE',
    description: 'FAQ : livraison, retours, paiement, fidélité. Questions fréquentes MAISON LA GRACE.',
    url: 'https://maisonlagrace.fr/faq',
    siteName: 'MAISON LA GRACE',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: { canonical: 'https://maisonlagrace.fr/faq' },
};

const faqs = [
  {
    q: 'Livrez-vous en Europe ?',
    a: 'Oui, nous livrons en France, en Belgique, en Suisse et dans toute l\'Europe. Les délais varient de 3 à 7 jours selon la destination. Les frais de livraison sont calculés lors de la validation de votre commande.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, les virements bancaires et les espèces à la livraison.',
  },
  {
    q: 'Les produits frais voyagent-ils bien ?',
    a: 'Nos produits frais (igname, manioc, plantain) partent le matin même pour une livraison rapide. En cas de problème lors de la réception, signalez-le sous 24 heures.',
  },
  {
    q: 'Comment faire un retour ?',
    a: 'Produits frais : signalement sous 24 h. Cosmétiques non ouverts : 14 jours. Contactez-nous via notre page de contact pour initier un retour.',
  },
  {
    q: 'Y a-t-il une commande minimum ?',
    a: 'Non, aucune commande minimum n\'est requise. La livraison est offerte en France dès 80 € d\'achat.',
  },
  {
    q: 'Comment utiliser mon bon de fidélité ?',
    a: 'Pour chaque commande d\'au moins 100 €, vous recevez automatiquement un bon d\'achat de 10 €. Ce bon est utilisable sur votre prochaine commande, sans minimum.',
  },
  {
    q: 'Les codes promo ont-ils une limite d\'utilisation ?',
    a: 'Nos codes promo sont illimités en nombre d\'utilisations et renouvelables chaque année. Vous pouvez les utiliser autant de fois que vous le souhaitez pendant leur période de validité.',
  },
  {
    q: 'Comment suivre ma commande ?',
    a: 'Après validation de votre commande, vous recevez un e-mail de confirmation avec un numéro de suivi. Vous pouvez également suivre l\'état de vos commandes depuis votre espace client.',
  },
];

export default function FAQ() {
  return (
    <>
      <Header menu={[]} />
      <main id="main" style={{ flex: 1 }}>
        <section className="section section--tight">
          <div className="wrap" style={{ maxWidth: '720px' }}>
            <span className="eyebrow eyebrow--muted">Service client</span>
            <h1 className="h-display h1" style={{ marginTop: '8px' }}>Questions fréquentes</h1>
            <p className="lede" style={{ marginTop: '16px', marginBottom: '40px' }}>
              Retrouvez les réponses aux questions les plus posées.
            </p>

            <div className="faq-list">
              {faqs.map((faq, i) => (
                <details key={i} className="acc__item" open={i === 0}>
                  <summary className="acc__q">
                    {faq.q}
                    <span className="acc__ico" aria-hidden="true" />
                  </summary>
                  <div className="acc__a">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>

            <div style={{ marginTop: '48px', padding: '32px', background: 'var(--paper-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
              <h2 className="h-display h3" style={{ marginBottom: '8px' }}>Vous n&apos;avez pas trouvé votre réponse ?</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
                Notre équipe est disponible du lundi au samedi, de 8h à 18h.
              </p>
              <a href="/contact" className="btn btn--primary">
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
