import { getTheme, getMenu } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function NosValeursPage() {
  const [theme, menu] = await Promise.all([getTheme(), getMenu()]);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Nos valeurs</span>
        </nav>
      </div>

      <main id="main" className="wrap section--tight" style={{ maxWidth: '800px', paddingBottom: '96px' }}>
        <span className="eyebrow">Nos Engagements</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Nos Valeurs & Engagements
        </h1>

        <div style={{ fontSize: '16.5px', lineHeight: '1.7', color: 'var(--ink-2)' }}>
          <p style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '24px' }}>
            Chaque produit MAISON LA GRACE incarne des valeurs précises que nous défendons au quotidien, de la récolte à la livraison.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Sourcing direct & juste rémunération
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Nous travaillons exclusivement avec des coopératives de femmes et des producteurs locaux au Burkina Faso, au Sénégal, en Côte d&apos;Ivoire et au Maroc. En supprimant les intermédiaires, nous garantissons une juste rémunération à la source.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Formulation pure & respect de la peau
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Tous nos cosmétiques sont élaborés à partir de matières premières brutes, non raffinées, extraites à froid. Aucun agent de blanchiment, aucun parfum artificiel ni conservateur superflu n&apos;est ajouté.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Transparence totale
          </h2>
          <p style={{ marginBottom: '20px' }}>
            La traçabilité de chaque produit est garantie, du producteur au flacon. Chaque lot est identifiable et chaque origine vérifiable.
          </p>

          <h2 className="h-display h3" style={{ marginTop: '40px', marginBottom: '16px' }}>
            Engagement éco-responsable
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Nos emballages sont recyclables, nos expéditions neutres en carbone. Nous offsettons l&apos;ensemble de notre empreinte logistique.
          </p>

          <div style={{ marginTop: '40px', padding: '24px', borderRadius: 'var(--r-lg)', background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
            <h3 className="h-display h3" style={{ marginBottom: '8px' }}>En résumé</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8 }}>
              <li>100% ingrédients bruts d&apos;origine contrôlée</li>
              <li>Traçabilité totale du producteur au flacon</li>
              <li>Emballages recyclables et expédition neutre en carbone</li>
              <li>Juste rémunération des producteurs partenaires</li>
              <li>Aucun test sur les animaux</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
