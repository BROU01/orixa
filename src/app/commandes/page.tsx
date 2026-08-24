'use client';

import { useState, useEffect } from 'react';
import type { MenuItem, Theme, Product } from '@/types';
import { getMenu, getTheme, getProducts } from '@/lib/data';
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

// Liste des catégories périssables (denrées alimentaires)
const PERISHABLE_CATEGORIES = ['exotic', 'exotiques'];

// Mots-clés indicatifs de produits périssables
const PERISHABLE_KEYWORDS = [
  'gari', 'hibiscus', 'gombo', 'igname', 'piment', 'attieke',
  'manioc', 'koms', 'tapioca', 'banane', 'aubergine', 'farine',
  'cossete', 'cube',
];

function isPerishable(article: OrderItem, allProducts: Product[]): boolean {
  // Chercher le produit par nom dans la base
  const product = allProducts.find(
    (p) => p.nom.toLowerCase() === article.nom.toLowerCase(),
  );

  if (product) {
    return PERISHABLE_CATEGORIES.includes(product.cat);
  }

  // Fallback : vérifier par mots-clés dans le nom
  const lowerName = article.nom.toLowerCase();
  return PERISHABLE_KEYWORDS.some((kw) => lowerName.includes(kw));
}

function getExclusionReason(article: OrderItem): string {
  const lowerName = article.nom.toLowerCase();
  const isExotic = PERISHABLE_KEYWORDS.some((kw) => lowerName.includes(kw));

  if (isExotic) {
    return 'Les denrées périssables ne peuvent être ni reprises ni échangées, conformément à la réglementation en vigueur.';
  }
  return 'Ce produit est classé comme denrée périssable et est exclu du droit de rétractation.';
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loyalty, setLoyalty] = useState<ReturnType<typeof getLoyaltyDisplay> | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // État retour
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnArticleIdx, setReturnArticleIdx] = useState<number | null>(null);
  const [returnMsg, setReturnMsg] = useState<{ type: 'blocked' | 'success'; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    Promise.all([getMenu(), getTheme(), getProducts()]).then(([m, t, p]) => {
      setMenu(m);
      setTheme(t);
      setAllProducts(p);
    });

    try {
      const stored = localStorage.getItem('orixa:orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch { /* ignore */ }

    setLoyalty(getLoyaltyDisplay());
  }, []);

  const handleRequestReturn = (orderId: string, articleIdx: number) => {
    setReturnOrderId(orderId);
    setReturnArticleIdx(articleIdx);
    setReturnMsg(null);

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const article = order.articles[articleIdx];
    if (!article) return;

    if (isPerishable(article, allProducts)) {
      setReturnMsg({
        type: 'blocked',
        text: getExclusionReason(article),
      });
    } else {
      setReturnMsg({
        type: 'success',
        text: `Votre demande de retour pour « ${article.nom} » sera traitée. Contactez notre service client via la page de contact avec votre numéro de commande #${orderId}.`,
      });
    }
  };

  const closeReturnModal = () => {
    setReturnOrderId(null);
    setReturnArticleIdx(null);
    setReturnMsg(null);
  };

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
            <a href="/cosmetiques" className="btn btn--primary">
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
                  {order.articles?.map((art, idx) => {
                    const perishable = isPerishable(art, allProducts);
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          <span>{art.qty}x {art.nom}</span>
                          {perishable && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                              style={{ background: 'var(--paper-3)', color: 'var(--muted)', letterSpacing: '0.5px' }}
                            >
                              Périssable
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <PriceTag amount={art.prix * art.qty} className="font-semibold" />
                          {/* Bouton retour par article — REQ-31 */}
                          {order.statut !== 'Remboursée' && (
                            <button
                              type="button"
                              onClick={() => handleRequestReturn(order.id, idx)}
                              className="underline text-[10px] font-semibold"
                              style={{ color: 'var(--muted)' }}
                            >
                              Retour
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

      {/* Modal retour — REQ-31 */}
      {returnOrderId && returnArticleIdx !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(35,33,44,.5)', padding: '16px',
          }}
          onClick={closeReturnModal}
        >
          <div
            style={{
              background: 'var(--surface)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line)', padding: '32px',
              maxWidth: '480px', width: '100%',
              boxShadow: 'var(--sh-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 className="h-display h3">Demande de retour</h2>
              <button
                type="button"
                onClick={closeReturnModal}
                aria-label="Fermer"
                style={{ color: 'var(--muted)', padding: '4px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
              Commande #{returnOrderId} — Article : {orders.find((o) => o.id === returnOrderId)?.articles[returnArticleIdx]?.nom}
            </p>

            {returnMsg && (
              <div
                role="alert"
                style={{
                  padding: '16px', borderRadius: 'var(--r-md)', fontSize: '13px', lineHeight: 1.6,
                  ...(returnMsg.type === 'blocked'
                    ? {
                        background: 'rgba(139,37,0,.06)',
                        border: '1px solid rgba(139,37,0,.25)',
                        color: 'var(--brick)',
                      }
                    : {
                        background: 'rgba(45,106,58,.06)',
                        border: '1px solid rgba(45,106,58,.25)',
                        color: 'var(--ok)',
                      }),
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '6px' }}>
                  {returnMsg.type === 'blocked' ? 'Retour non autorisé' : 'Retour éligible'}
                </p>
                <p>{returnMsg.text}</p>
              </div>
            )}

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeReturnModal}
                className="btn btn--secondary btn--sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer theme={theme || undefined} />
    </div>
  );
}
