import type { Metadata } from 'next';
import Script from 'next/script';
import CookieConsent from '@/components/CookieConsent';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const SITE_URL = 'https://maisonlagrace.fr';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MAISON LA GRACE — Cosmétiques naturels & produits exotiques d\'Afrique',
    template: '%s — MAISON LA GRACE',
  },
  description:
    'Cosmétiques naturels et produits exotiques d\'Afrique de l\'Ouest : beurre de karité, hibiscus, gari, gombo. Livraison offerte dès 80 € partout en Europe. Maison française, ingrédients 100 % purs.',
  keywords: [
    'cosmétiques naturels',
    'produits exotiques',
    'beurre de karité',
    'karité pur',
    'hibiscus séché',
    'gari précuit',
    'gombo moulu',
    'produits Afrique',
    'cosmétiques bio',
    'soins naturels peau',
    'boutique africaine Europe',
    'MAISON LA GRACE',
    'produits bio',
    'ingrédients naturels',
    'livraison Europe',
    'cosmétiques français',
    'pommade karité',
    'coiffe karité',
    'igname',
    'épices africaines',
  ],
  authors: [{ name: 'MAISON LA GRACE' }],
  creator: 'MAISON LA GRACE',
  publisher: 'MAISON LA GRACE',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'MAISON LA GRACE',
    title: 'MAISON LA GRACE — Cosmétiques naturels & produits exotiques d\'Afrique',
    description:
      'Beurre de karité, hibiscus, gari, gombo et cosmétiques naturels. Livraison offerte dès 80 € partout en Europe.',
    images: [
      {
        url: '/img/hero-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'MAISON LA GRACE — Cosmétiques naturels & produits exotiques',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAISON LA GRACE — Cosmétiques naturels & produits exotiques',
    description:
      'Beurre de karité, hibiscus, gari, gombo. Livraison offerte dès 80 €.',
    images: ['/img/hero-poster.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || '';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ── Google Search Console Verification ── */}
        {GSC_VERIFICATION && (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        )}
        {/* ── Google Analytics (GA4) ── */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* ── JSON-LD Structured Data (Organization + WebSite) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MAISON LA GRACE',
              url: SITE_URL,
              logo: `${SITE_URL}/logo-maison-la-grace.svg`,
              description:
                'Cosmétiques naturels et produits exotiques d\'Afrique de l\'Ouest, livrés partout en Europe.',
              sameAs: [
                'https://instagram.com/kalipe.constance',
                'https://facebook.com/laGrace',
                'https://tiktok.com/@kalipe.constance',
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: '23 rue Aimé Césaire',
                addressLocality: 'Vernon',
                postalCode: '27200',
                addressRegion: 'Normandie',
                addressCountry: 'FR',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+33664241678',
                email: 'maroquinerie.lagrace@gmail.com',
                contactType: 'customer service',
                availableLanguage: 'French',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MAISON LA GRACE',
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/cosmetiques?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'MAISON LA GRACE',
              url: SITE_URL,
              description:
                'Boutique de cosmétiques naturels et produits exotiques d\'Afrique de l\'Ouest.',
              image: [`${SITE_URL}/logo-maison-la-grace.png`],
              address: {
                '@type': 'PostalAddress',
                streetAddress: '23 rue Aimé Césaire',
                addressLocality: 'Vernon',
                postalCode: '27200',
                addressRegion: 'Normandie',
                addressCountry: 'FR',
              },
              telephone: '+33664241678',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+33664241678',
                email: 'maroquinerie.lagrace@gmail.com',
                contactType: 'customer service',
                availableLanguage: 'French',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 49.0972,
                longitude: 1.4856,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday'],
                  opens: '10:00',
                  closes: '13:00',
                },
              ],
              priceRange: '$$',
              areaServed: {
                '@type': 'Country',
                name: 'France',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Cosmétiques & Produits exotiques',
                itemListElement: [
                  { '@type': 'Offer', 'itemOffered': { '@type': 'Product', name: 'Beurre de karité' } },
                  { '@type': 'Offer', 'itemOffered': { '@type': 'Product', name: 'Hibiscus séché' } },
                  { '@type': 'Offer', 'itemOffered': { '@type': 'Product', name: 'Gari précuit' } },
                ],
              },
            }),
          }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
