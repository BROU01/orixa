'use client';

import { useState, useEffect } from 'react';
import type { MenuItem, Theme } from '@/types';
import { getMenu, getTheme } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';

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
          Mes Commandes ({orders.length})
        </h1>

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
