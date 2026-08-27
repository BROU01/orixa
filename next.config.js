/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  // ── Security Headers ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Empêche le clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Empêche le MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Protection XSS intégrée au navigateur
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer Policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions Policy (caméra, micro, géoloc = non)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // HSTS (HTTPS obligatoire, 1 an, inclut les sous-domaines)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Content Security Policy (CSP) — autorise uniquement ce qui est nécessaire
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              ...(isProduction ? ["upgrade-insecure-requests"] : []),
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
