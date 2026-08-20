'use client';

import { useState, useEffect } from 'react';
import type { MenuItem, Theme } from '@/types';
import { getMenu, getTheme } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import { getLoyaltyDisplay, LOYALTY_CONFIG } from '@/lib/loyalty';

interface OrderItem {
  nom: string;
  qty: number;
  prix: number;
}

interface Order {
  id: string;
  date: string;
  client: string;
  email: string;
  adresse: string;
  livraison: string;
  paiement: string;
  total: number;
  articles: OrderItem[];
  statut: string;
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loyalty, setLoyalty] = useState<ReturnType<typeof getLoyaltyDisplay> | null>(null);

  useEffect(() => {
    setMounted(true);
    Promise.all([getMenu(), getTheme()]).then(([m, t]) => {
      setMenu(m);
      setTheme(t);
    });

    try {
      const stored = localStorage.getItem('orixa:orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch { /* ignore */ }

    setLoyalty(getLoyaltyDisplay());
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme || undefined} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Mes Commandes</span>
        </nav>
      </div>

      <main className="wrap section--tight" style={{ paddingBottom: '96px' }}>
        <span className="eyebrow">Historique client</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Mes Commandes
        </h1>

        {/* Solde fidélité */}
        {loyalty && (
          <div className="p-5 rounded-xl border border-[var(--line)] mb-8" style={{ background: 'var(--surface)' }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="eyebrow" style={{ marginBottom: '4px' }}>Programme de fidélité</span>
                <p style={{ fontSize: '15px', fontWeight: 600, marginTop: '4px' }}>
                  {loyalty.cumulativeSpend.toFixed(2)} € cumulés — prochain palier à {loyalty.nextThreshold} €
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ok)' }}>
                  {loyalty.availableVouchers.length} bon{loyalty.availableVouchers.length > 1 ? 's' : ''} disponible{loyalty.availableVouchers.length > 1 ? 's' : ''}
                </p>
                {loyalty.availableVouchers.length > 0 && (
                  <p style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {loyalty.availableVouchers.length} x {LOYALTY_CONFIG.VOUCHER_AMOUNT} € = {loyalty.availableVouchers.length * LOYALTY_CONFIG.VOUCHER_AMOUNT} € de réduction
                  </p>
                )}
              </div>
            </div>
            {/* Barre de progression */}
            <div style={{ marginTop: '12px', height: '6px', borderRadius: '3px', background: 'var(--line)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (loyalty.cumulativeSpend / loyalty.nextThreshold) * 100)}%`, background: 'var(--ok)', borderRadius: '3px', transition: 'width .4s ease' }} />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
              {Math.max(0, loyalty.nextThreshold - loyalty.cumulativeSpend).toFixed(2)} € manquants pour le prochain bon de {LOYALTY_CONFIG.VOUCHER_AMOUNT} €
            </p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty">
            <h2 className="empty__title">Aucune commande enregistrée</h2>
            <p className="empty__text">Vos commandes passées apparaîtront ici avec leur numéro de suivi et récapitulatif.</p>

            <a href="/boutique" className="btn btn--primary">
              Passer ma première commande
            </a>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            {orders.map((order) => (
              <div key={order.id} className="p-6 rounded-xl border border-[var(--line)] bg-white shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-[var(--brand-hover)]">Commande #{order.id}</span>
                    <p className="text-xs text-[var(--muted)]">Effectuée le {order.date}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.statut === 'Livrée' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.statut}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p><strong>Livraison :</strong> {order.livraison} — {order.adresse}</p>
                  <p><strong>Paiement :</strong> {order.paiement}</p>
                </div>

                <div className="border-t border-[var(--line)] pt-3 space-y-1">
                  {order.articles?.map((art, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{art.qty}x {art.nom}</span>
                      <PriceTag amount={art.prix * art.qty} className="font-semibold" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-[var(--line)] pt-3">
                  <span className="text-xs font-bold uppercase">Montant total</span>
                  <PriceTag amount={order.total} className="text-base font-bold text-[var(--brand-hover)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer theme={theme || undefined} />
    </div>
  );
}
