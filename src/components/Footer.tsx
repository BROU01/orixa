import type { Theme } from '@/types';

/**
 * Configuration des réseaux sociaux.
 * Ajouter ou retirer un réseau = modifier ce tableau uniquement.
 */
const SOCIAL_LINKS: Array<{
  name: string;
  url: string;
  label: string;
  icon: JSX.Element;
}> = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/orixa',
    label: 'MAISON LA GRACE sur Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/orixa',
    label: 'MAISON LA GRACE sur Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@orixa',
    label: 'MAISON LA GRACE sur TikTok',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
];

interface FooterProps {
  theme?: Theme;
}

/**
 * Composant Footer sémantique MAISON LA GRACE.
 * - 5 liens uniques dans « Informations » (pas de doublons)
 * - Sous-footer : copyright + logos paiement uniquement
 * - Réseaux sociaux en SVG monochromes avec aria-label
 * - Aucun Pinterest
 */
export default function Footer({ theme }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">

          {/* Brand Col + Socials */}
          <div className="site-footer__brand">
            <a href="/" aria-label="MAISON LA GRACE">
              <img src="/logo-maison-la-grace.svg" alt="MAISON LA GRACE" style={{ height: '40px', width: 'auto' }} />
            </a>
            <p className="site-footer__about" data-footer-about>
              {theme?.footerAbout || 'Cosmétiques naturels et produits exotiques sélectionnés avec soin, livrés partout en Europe depuis notre atelier.'}
            </p>

            {/* Réseaux sociaux — config-driven */}
            {SOCIAL_LINKS.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="social-icon"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* La maison */}
          <nav className="site-footer__col" aria-label="La maison">
            <h3 className="site-footer__title">La maison</h3>
            <ul className="site-footer__list">
              <li><a href="/histoire">Notre histoire</a></li>
              <li><a href="/nos-valeurs">Nos valeurs</a></li>
            </ul>
          </nav>

          {/* Boutique */}
          <nav className="site-footer__col" aria-label="Boutique">
            <h3 className="site-footer__title">Boutique</h3>
            <ul className="site-footer__list">
              <li><a href="/cosmetiques">Cosmétiques</a></li>
              <li><a href="/exotiques">Produits exotiques</a></li>
            </ul>
          </nav>

          {/* Services */}
          <nav className="site-footer__col" aria-label="Services">
            <h3 className="site-footer__title">Services</h3>
            <ul className="site-footer__list">
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact#livraison">Livraison</a></li>
              <li><a href="/retours">Retours</a></li>
            </ul>
          </nav>

          {/* Mon compte */}
          <nav className="site-footer__col" aria-label="Mon compte">
            <h3 className="site-footer__title">Mon compte</h3>
            <ul className="site-footer__list">
              <li><a href="/compte">Connexion</a></li>
              <li><a href="/favoris">Mes favoris</a></li>
              <li><a href="/commandes">Mes commandes</a></li>
            </ul>
          </nav>

          {/* Informations — exactement 5 liens uniques */}
          <nav className="site-footer__col" aria-label="Informations">
            <h3 className="site-footer__title">Informations</h3>
            <ul className="site-footer__list">
              <li><a href="/mentions-legales">Mentions légales</a></li>
              <li><a href="/confidentialite">Politique de confidentialité</a></li>
              <li><a href="/cookies">Politique de cookies</a></li>
              <li><a href="/cgv">Conditions générales de vente</a></li>
              <li><a href="/paiements-securises">Paiements sécurisés</a></li>
            </ul>
          </nav>
        </div>

        <hr className="site-footer__rule" />

        {/* Reassurance & Paiements */}
        <div className="site-footer__trust">
          <div className="site-footer__trust-group">
            <h4 className="site-footer__trust-title">Paiements sécurisés</h4>
            <ul className="site-footer__pay">
              <li>
                <svg className="pay-badge" role="img" aria-label="Visa" viewBox="0 0 46 14">
                  <rect width="46" height="14" rx="2" fill="#1A1F71" />
                  <text x="23" y="10" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="7.5" fill="#fff" letterSpacing=".5">VISA</text>
                </svg>
              </li>
              <li>
                <svg className="pay-badge" role="img" aria-label="Mastercard" viewBox="0 0 46 14">
                  <rect width="46" height="14" rx="2" fill="#fff" />
                  <circle cx="18" cy="7" r="4.2" fill="#EB001B" />
                  <circle cx="23" cy="7" r="4.2" fill="#F79E1B" fillOpacity=".92" />
                  <path d="M20.5 3.4a4.2 4.2 0 0 0 0 7.2 4.2 4.2 0 0 0 0-7.2z" fill="#FF5F00" />
                </svg>
              </li>
              <li>
                <svg className="pay-badge" role="img" aria-label="PayPal" viewBox="0 0 46 14">
                  <rect width="46" height="14" rx="2" fill="#003087" />
                  <text x="23" y="10" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="6.5" fill="#fff" letterSpacing=".3">PayPal</text>
                </svg>
              </li>
            </ul>
          </div>
          <div className="site-footer__trust-group">
            <h4 className="site-footer__trust-title">Livraison</h4>
            <p style={{ fontSize: '13px', color: 'var(--footer-ink)', lineHeight: 1.6 }}>
              Partout en Europe — 24 à 72h
            </p>
          </div>
        </div>

        <hr className="site-footer__rule" />

        {/* Bas de page — copyright uniquement (pas de doublons de liens) */}
        <div className="site-footer__legal">
          <p>&copy; {new Date().getFullYear()} MAISON LA GRACE — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
