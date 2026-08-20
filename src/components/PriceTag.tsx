'use client';

import { useState, useEffect } from 'react';
import { getVisitorCurrency, formatPrice } from '@/lib/currency';

interface PriceTagProps {
  amount: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function PriceTag({ amount, className = '', style }: PriceTagProps) {
  const [currency, setCurrency] = useState<string>('EUR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrency(getVisitorCurrency());

    const handleCurrencyChange = (e: Event) => {
      const customEv = e as CustomEvent<string>;
      if (customEv.detail) {
        setCurrency(customEv.detail);
      } else {
        setCurrency(getVisitorCurrency());
      }
    };

    window.addEventListener('orixa:currency-changed', handleCurrencyChange);
    return () => window.removeEventListener('orixa:currency-changed', handleCurrencyChange);
  }, []);

  if (!mounted) {
    return <span className={className} style={style}>{amount.toFixed(2)} €</span>;
  }

  return <span className={className} style={style}>{formatPrice(amount, currency)}</span>;
}
