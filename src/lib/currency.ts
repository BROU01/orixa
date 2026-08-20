/**
 * ORIXA — Multi-Currency Helper Module
 * Expose les devises supportées, le taux de conversion et les fonctions de formatage.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  pos: 'after' | 'before';
  locale: string;
}

export const ORIXA_CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (€)', rate: 1, pos: 'after', locale: 'fr-FR' },
  XOF: { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA (FCFA)', rate: 655.957, pos: 'after', locale: 'fr-FR' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar ($)', rate: 1.09, pos: 'before', locale: 'en-US' },
  GBP: { code: 'GBP', symbol: '£', name: 'Livre Sterling (£)', rate: 0.86, pos: 'before', locale: 'en-GB' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse (CHF)', rate: 0.94, pos: 'after', locale: 'fr-CH' },
  MAD: { code: 'MAD', symbol: 'DH', name: 'Dirham Marocain (DH)', rate: 10.8, pos: 'after', locale: 'fr-MA' },
};

export const DEFAULT_CURRENCY = 'EUR';

export function getVisitorCurrency(): string {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  try {
    const saved = localStorage.getItem('orixa:visitor-currency');
    if (saved && ORIXA_CURRENCIES[saved]) return saved;
  } catch {
    // Ignore localStorage read errors
  }
  return DEFAULT_CURRENCY;
}

export function setVisitorCurrency(code: string): void {
  if (typeof window === 'undefined') return;
  if (!ORIXA_CURRENCIES[code]) return;
  try {
    localStorage.setItem('orixa:visitor-currency', code);
    window.dispatchEvent(new CustomEvent('orixa:currency-changed', { detail: code }));
  } catch {
    // Ignore localStorage write errors
  }
}

export function formatPrice(montantEUR: number, currencyCode: string = DEFAULT_CURRENCY): string {
  const curr = ORIXA_CURRENCIES[currencyCode] || ORIXA_CURRENCIES[DEFAULT_CURRENCY];
  const converted = montantEUR * curr.rate;
  
  if (curr.code === 'XOF') {
    return `${Math.round(converted).toLocaleString('fr-FR')} FCFA`;
  }
  
  try {
    const formatted = new Intl.NumberFormat(curr.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);

    return curr.pos === 'before'
      ? `${curr.symbol}${formatted}`
      : `${formatted} ${curr.symbol}`;
  } catch {
    return `${converted.toFixed(2)} ${curr.symbol}`;
  }
}
