import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Notre histoire — Maison MAISON LA GRACE',
  description:
    "Découvrez l'histoire d'MAISON LA GRACE : cosmétiques naturels et produits exotiques d'Afrique, circuit court, coopératives éco-responsables.",
  keywords: ['MAISON LA GRACE histoire', 'cosmétiques naturels', 'coopératives Afrique', 'circuit court', 'karité'],
  openGraph: {
    title: 'Notre histoire — MAISON LA GRACE',
    description:
      'Cosmétiques naturels et produits exotiques d\'Afrique. Circuit court, coopératives éco-responsables.',
    url: 'https://maisonlagrace.fr/histoire',
    siteName: 'MAISON LA GRACE',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: { canonical: 'https://maisonlagrace.fr/histoire' },
};

export default async function HistoirePage() {
  const [theme, menu] = await Promise.all([getTheme(), getMenu()]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Notre histoire</span>
        </nav>
      </div>

      <main id="main" className="wrap section--tight" style={{ maxWidth: '800px', paddingBottom: '96px' }}>
        <span className="eyebrow" id="valeurs">La Maison MAISON LA GRACE</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Une Histoire de Transmission & d&apos;Excellence
        </h1>

        <div className="prose" style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--ink-2)' }}>
          <p className="lede" style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--ink)' }}>
            MAISON LA GRACE est née d&apos;une vocation profonde : sublimer les rituels de beauté et les saveurs de terroir authentiques d&apos;Afrique de l&apos;Ouest et les transmettre avec exigence en France et dans toute l&apos;Europe.
          </p>

          <h2 className="h-display h2" style={{ marginTop: '40px', marginBottom: '16px' }} id="producteurs">
            Notre Philosophie & Nos Coopératives
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Fondée par une passion pour les savoir-faire et les trésors naturels d&apos;Afrique, la maison s&apos;approvisionne directement auprès de groupements de femmes et de producteurs locaux au Burkina Faso (beurres de karité bruts de Koudougou), au Sénégal (fleurs d&apos;hibiscus séchées), en Côte d&apos;Ivoire et au Maroc.
          </p>

          <p style={{ marginBottom: '20px' }}>
            Nous sélectionnons exclusivement des matières premières pures, non raffinées, extraites à froid selon des techniques artisanales séculaires. Aucun agent de blanchiment, aucun parfum artificiel ni conservateur superflu n&apos;est ajouté.
          </p>

          <h2 className="h-display h2" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Engagement Éco-Responsable & Circuit Court
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Chaque achat soutient directement l&apos;émancipation économique des femmes collectrices dans les villages partenaires. En supprimant les intermédiaires spéculatifs, nous garantissons une juste rémunération à la source et des prix accessibles pour nos clients en Europe.
          </p>

          <div className="history-quality">
            <h3 className="h-display h3" style={{ marginBottom: '8px' }}>L&apos;Engagement Qualité MAISON LA GRACE</h3>
            <ul className="history-quality__list">
              <li>100% Ingrédients bruts d&apos;origine contrôlée</li>
              <li>Traçabilité totale du producteur au flacon</li>
              <li>Emballages recyclables et expédition neutre en carbone</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
