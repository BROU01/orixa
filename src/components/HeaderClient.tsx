'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { MenuItem, Theme } from '@/types';
import { ORIXA_CURRENCIES, getVisitorCurrency, setVisitorCurrency } from '@/lib/currency';

interface HeaderClientProps {
  menu: MenuItem[];
  theme?: Theme;
}

export default function HeaderClient({ menu, theme }: HeaderClientProps) {
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrencyState] = useState<string>('EUR');
  const [currencyOpen, setCurrencyOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    setCurrencyState(getVisitorCurrency());

    const updateCounts = () => {
      try {
        const cartStr = localStorage.getItem('orixa:cart');
        if (cartStr) {
          const cartItems = JSON.parse(cartStr);
          const total = Array.isArray(cartItems)
            ? cartItems.reduce((acc: number, item: { qty?: number; qte?: number }) => acc + (item.qty || item.qte || 1), 0)
            : 0;
          setCartCount(total);
        } else {
          setCartCount(0);
        }

        const favStr = localStorage.getItem('orixa:favs');
        if (favStr) {
          const favs = JSON.parse(favStr);
          setFavCount(Array.isArray(favs) ? favs.length : 0);
        } else {
          setFavCount(0);
        }
      } catch { /* ignore */ }
    };

    updateCounts();

    const handleCartUpdate = () => updateCounts();
    const handleFavUpdate = () => updateCounts();
    const handleCurrencyChange = (e: Event) => {
      const customEv = e as CustomEvent<string>;
      if (customEv.detail) setCurrencyState(customEv.detail);
    };

    window.addEventListener('storage', updateCounts);
    window.addEventListener('orixa:cart-updated', handleCartUpdate);
    window.addEventListener('orixa:favs-updated', handleFavUpdate);
    window.addEventListener('orixa:currency-changed', handleCurrencyChange);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('orixa:cart-updated', handleCartUpdate);
      window.removeEventListener('orixa:favs-updated', handleFavUpdate);
      window.removeEventListener('orixa:currency-changed', handleCurrencyChange);
    };
  }, []);

  const handleSelectCurrency = (code: string) => {
    setVisitorCurrency(code);
    setCurrencyState(code);
    setCurrencyOpen(false);
  };

  const defaultNavLinks = [
    { label: 'Accueil', url: '/' },
    { label: 'Cosmétiques', url: '/cosmetiques' },
    { label: 'Produits exotiques', url: '/exotiques' },
    { label: 'Nouveautés', url: '/nouveautes' },
    { label: 'Contact', url: '/contact' },
  ];

  return (
    <>
      {/* Bandeau d'annonce original */}
      {theme?.announceOn && theme.announce && (
        <div className="announce">
          {theme.announce}
        </div>
      )}

      {/* Header Sticky original */}
      <header className="header">
        <div className="header__bar">
          
          {/* Logo Original */}
          <a href="/" className="brand__mark" aria-label="MAISON LA GRACE, accueil">
            <Image src="/logo-maison-la-grace.svg" alt="MAISON LA GRACE" width={224} height={56} style={{ height: '56px', width: 'auto' }} unoptimized priority />
          </a>

          {/* Navigation principale */}
          <nav className="nav" aria-label="Navigation principale">
            {defaultNavLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="nav__link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions header (Devises + Favoris + Panier + Compte) */}
          <div className="header__actions">
            
            {/* Multi-Currency Dropdown */}
            <div className="header__currency" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="btn btn--secondary btn--sm"
                title="Changer de devise"
                style={{ height: '36px', paddingInline: '10px', fontSize: '11px', gap: '4px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>{currency}</span>
                <span style={{ fontSize: '9px' }}>▼</span>
              </button>

              {currencyOpen && (
                <div className="currency-dropdown-custom">
                  {Object.values(ORIXA_CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectCurrency(c.code)}
                      className={`currency-opt-item ${currency === c.code ? 'active' : ''}`}
                    >
                      <span>{c.name}</span>
                      <span>{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favoris icon button */}
            <a
              href="/favoris"
              className="icon-btn"
              aria-label="Mes favoris"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.8 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              {mounted && favCount > 0 && (
                <span className="icon-btn__count">{favCount}</span>
              )}
            </a>

            {/* Panier icon button */}
            <a
              href="/commande"
              className="icon-btn"
              aria-label="Mon panier"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {mounted && cartCount > 0 && (
                <span className="icon-btn__count">{cartCount}</span>
              )}
            </a>

            {/* Account Icon / Link */}
            <a
              href="/compte"
              className="icon-btn"
              aria-label="Mon compte"
              title="Connexion"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>

            {/* Burger mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn header__burger"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation mobile originale */}
        {mobileMenuOpen && (
          <nav className="mobile-nav" data-open="true">
            {defaultNavLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="/compte" onClick={() => setMobileMenuOpen(false)}>
              Mon compte / Connexion
            </a>
            <div className="mobile-nav__currency">
              <label htmlFor="mobile-currency">Devise</label>
              <select
                id="mobile-currency"
                className="mobile-nav__currency-select"
                value={currency}
                onChange={(event) => handleSelectCurrency(event.target.value)}
                aria-label="Choisir la devise"
              >
                {Object.values(ORIXA_CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
