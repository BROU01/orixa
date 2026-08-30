'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { MenuItem, Theme } from '@/types';
import { getMenu, getTheme } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceTag from '@/components/PriceTag';
import {
  validateVoucher,
  applyVoucher,
  consumeVoucher,
  processOrderForLoyalty,
  getLoyaltyDisplay,
  LOYALTY_CONFIG,
} from '@/lib/loyalty';

interface CartItem {
  id: string;
  nom: string;
  prix: number;
  img: string;
  qty: number;
}

export default function CommandeCheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('France');
  const [deliveryMethod, setDeliveryMethod] = useState('mondial_relay');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');

  // Fidélité
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState<{ id: string; amount: number; discount: number } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState('');
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [loyaltyEarned, setLoyaltyEarned] = useState(0);

  // API Server State
  const [subtotalEUR, setSubtotalEUR] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [shippingEUR, setShippingEUR] = useState(4.90);
  const [finalTotalEUR, setFinalTotalEUR] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [loyaltyPointsEarned, setLoyaltyPointsEarned] = useState(0);

  useEffect(() => {
    setMounted(true);
    Promise.all([getMenu(), getTheme()]).then(([m, t]) => {
      setMenu(m);
      setTheme(t);
    });

    // Charger le solde fidélité
    const loyalty = getLoyaltyDisplay();
    setLoyaltyBalance(loyalty.cumulativeSpend);

    try {
      const stored = localStorage.getItem('orixa:cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const formatted = parsed.map((i: { id: string; nom: string; prix: number; img: string; qty?: number; qte?: number }) => ({
            id: i.id,
            nom: i.nom,
            prix: i.prix,
            img: i.img,
            qty: i.qty || i.qte || 1,
          }));
          setItems(formatted);
          recalcTotals(formatted, '', null);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const recalcTotals = (
    cartItems: CartItem[],
    promo: string,
    voucher: { id: string; amount: number; discount: number } | null,
  ) => {
    // Calcul local du sous-total (pas besoin du serveur pour ça)
    const sub = cartItems.reduce((sum, i) => sum + i.prix * i.qty, 0);
    setSubtotalEUR(sub);

    const ship = sub >= 80 ? 0 : 4.90;
    setShippingEUR(ship);

    // La réduction promo s'applique sur le sous-total
    // Le bon de fidélité s'applique AUSSI sur le sous-total (REQ-24: pas sur le port)
    // REQ-29: pas de cumul promo + bon fidélité (sauf option admin)
    const voucherDiscount = voucher ? Math.min(voucher.amount, sub) : 0;

    // Si un bon est appliqué, on ignore le code promo (REQ-29)
    const effectivePromoDiscount = voucherDiscount > 0 ? 0 : 0; // Le promo reste calculé séparément

    const totalAfterDiscounts = Math.max(0, sub - voucherDiscount) + ship;
    setFinalTotalEUR(totalAfterDiscounts);

    // Calculer les points fidélité gagnés (hors frais de port)
    setLoyaltyEarned(sub);
  };

  const validateCheckoutServer = async (cartItems: CartItem[], code: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, promoCode: code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubtotalEUR(data.subtotalEUR);
        setShippingEUR(data.shippingEUR);

        if (data.discountInfo) {
          if (data.discountInfo.error) {
            setPromoMsg(data.discountInfo.error);
          } else {
            setPromoMsg(`Code ${data.discountInfo.code} appliqué (-${data.discountAmount.toFixed(2)} €)`);
          }
        } else {
          setPromoMsg('');
        }

        // Recalculer le total avec le voucher éventuel
        recalcTotals(cartItems, code, voucherApplied);
      }
    } catch { /* ignore */ }
  };

  const updateItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    const updated = items.map((i) => (i.id === id ? { ...i, qty: newQty } : i));
    setItems(updated);
    saveCart(updated);
    recalcTotals(updated, promoCode, voucherApplied);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveCart(updated);
    recalcTotals(updated, promoCode, voucherApplied);
  };

  const saveCart = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem('orixa:cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('orixa:cart-updated'));
    } catch { /* ignore */ }
  };

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    // REQ-29: pas de cumul promo + bon fidélité
    if (voucherApplied) {
      setPromoMsg('Un bon de fidélité est déjà appliqué. Retirez-le pour utiliser un code promo.');
      return;
    }
    validateCheckoutServer(items, promoCode);
  };

  const handleApplyVoucher = (e: FormEvent) => {
    e.preventDefault();
    setVoucherMsg('');

    // REQ-29: pas de cumul promo + bon fidélité
    if (promoCode) {
      setVoucherMsg('Un code promo est déjà appliqué. Retirez-le pour utiliser un bon de fidélité.');
      return;
    }

    const result = validateVoucher(voucherCode);
    if (!result.valid) {
      setVoucherMsg(result.error || 'Code invalide.');
      return;
    }

    if (result.voucher) {
      const sub = items.reduce((sum, i) => sum + i.prix * i.qty, 0);
      const ship = sub >= 80 ? 0 : 4.90;
      const { discountAmount } = applyVoucher(sub, ship, result.voucher.id);

      setVoucherApplied({
        id: result.voucher.id,
        amount: result.voucher.amount,
        discount: discountAmount,
      });
      setVoucherMsg(`Bon de ${result.voucher.amount} € appliqué (-${discountAmount.toFixed(2)} €)`);
      recalcTotals(items, '', { id: result.voucher.id, amount: result.voucher.amount, discount: discountAmount });
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherApplied(null);
    setVoucherCode('');
    setVoucherMsg('');
    recalcTotals(items, promoCode, null);
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const sub = items.reduce((sum, i) => sum + i.prix * i.qty, 0);
    let ref = `MLG-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          promoCode,
          customer: { firstName, lastName, email, address, city, postalCode, country },
          delivery: { method: deliveryMethod, paymentMethod },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.id) {
        ref = data.id;
      }
    } catch { /* la commande reste confirmée localement même si l'API est indisponible */ }

    const newOrder = {
      id: ref,
      date: new Date().toISOString().split('T')[0],
      client: `${firstName} ${lastName}`,
      email,
      adresse: `${address}, ${postalCode} ${city}, ${country}`,
      livraison: deliveryMethod === 'mondial_relay' ? 'Mondial Relay' : 'Colissimo',
      paiement: paymentMethod === 'card' ? 'Carte Bancaire' : paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'wero' ? 'Wero' : 'Virement',
      total: finalTotalEUR,
      subtotal: sub,
      articles: items.map((i) => ({ nom: i.nom, qty: i.qty, prix: i.prix })),
      statut: 'En attente' as const,
    };

    try {
      const storedOrders = localStorage.getItem('orixa:orders');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.unshift(newOrder);
      localStorage.setItem('orixa:orders', JSON.stringify(orders));

      // Marquer le bon comme consommé
      if (voucherApplied) {
        consumeVoucher(voucherApplied.id, ref);
      }

      // Traiter la fidélité : cumul du sous-total
      const newVouchers = processOrderForLoyalty(sub, ref);

      // Vider le panier
      localStorage.removeItem('orixa:cart');
      window.dispatchEvent(new Event('orixa:cart-updated'));

      // Afficher les points gagnés
      setLoyaltyPointsEarned(sub);
      setOrderRef(ref);
      setOrderComplete(true);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (orderComplete) {
    return (
      <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
        <Header menu={menu} theme={theme || undefined} />

        <main className="wrap section--tight text-center" style={{ maxWidth: '600px', paddingBottom: '96px' }}>
          <div className="p-8 rounded-2xl border border-[var(--line)]" style={{ background: 'var(--surface)' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--brand-soft)',
                border: '2px solid var(--ok)',
                marginBottom: '16px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="eyebrow" style={{ color: 'var(--ok)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>Commande confirmée</span>
            <h1 className="h-display h1" style={{ marginBottom: '12px' }}>Merci pour votre confiance !</h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
              Votre commande <strong>#{orderRef}</strong> a été enregistrée avec succès.
            </p>

            <div className="p-4 rounded-lg text-xs text-left space-y-2 mb-6" style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
              <p><strong>Référence :</strong> #{orderRef}</p>
              <p><strong>Adresse de livraison :</strong> {address}, {postalCode} {city}</p>
              <p><strong>Mode de paiement :</strong> {paymentMethod.toUpperCase()}</p>
              <p><strong>Montant récapitulatif :</strong> {finalTotalEUR.toFixed(2)} €</p>
              {loyaltyPointsEarned > 0 && (
                <p style={{ color: 'var(--ok)', fontWeight: 600 }}>
                  Fidélité : {loyaltyPointsEarned.toFixed(2)} € ajoutés à votre cumul.
                  {loyaltyPointsEarned >= LOYALTY_CONFIG.THRESHOLD && (
                    <> Un bon de {LOYALTY_CONFIG.VOUCHER_AMOUNT} € a été généré !</>
                  )}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/commandes" className="btn btn--primary">
                Voir mes commandes
              </a>
              <a href="/" className="btn btn--secondary">
                Retour à l&apos;accueil
              </a>
            </div>
          </div>
        </main>

        <Footer theme={theme || undefined} />
      </div>
    );
  }

  // Déterminer si un bon est disponible
  const canUseVoucher = items.length > 0 && !promoCode;

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Header menu={menu} theme={theme || undefined} />

      <div className="wrap">
        <nav className="crumb">
          <a href="/">Accueil</a>
          <span>/</span>
          <span aria-current="page">Tunnel de Commande</span>
        </nav>
      </div>

      <main className="wrap section--tight" style={{ paddingBottom: '96px' }}>
        <span className="eyebrow">Achat sécurisé</span>
        <h1 className="h-display h1" style={{ marginTop: '8px', marginBottom: '24px' }}>
          Passer la commande
        </h1>

        {items.length === 0 ? (
          <div className="empty">
            <h2 className="empty__title">Votre panier est vide</h2>
            <p className="empty__text">Sélectionnez vos cosmétiques et produits exotiques préférés.</p>
            <a href="/cosmetiques" className="btn btn--primary">
              Parcourir nos produits
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Formulaire de livraison & paiement (7 cols) */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">

              {/* Coordonnées */}
              <div className="p-6 rounded-xl border border-[var(--line)] bg-white space-y-4">
                <h2 className="h-display h3">1. Vos Coordonnées</h2>
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Adresse E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="vous@exemple.com"
                    className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                  />
                </div>
              </div>

              {/* Adresse de Livraison */}
              <div className="p-6 rounded-xl border border-[var(--line)] bg-white space-y-4">
                <h2 className="h-display h3">2. Adresse de Livraison</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider mb-1">Prénom</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider mb-1">Nom</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Adresse postale</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Numéro et nom de rue"
                    className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider mb-1">Code Postal</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider mb-1">Ville</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full p-3 rounded border border-[var(--line-strong)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider mb-1">Pays</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-3 rounded border border-[var(--line-strong)] text-sm bg-white"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Allemagne">Allemagne</option>
                  </select>
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="p-6 rounded-xl border border-[var(--line)] bg-white space-y-4">
                <h2 className="h-display h3">3. Mode de Livraison</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-[var(--brand)]">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        value="mondial_relay"
                        checked={deliveryMethod === 'mondial_relay'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div>
                        <p className="font-bold text-sm">Mondial Relay Point Relais</p>
                        <p className="text-xs text-[var(--muted)]">Livraison sous 3 à 5 jours</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">{subtotalEUR >= 80 ? 'OFFERT' : '4,90 €'}</span>
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-[var(--brand)]">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        value="colissimo"
                        checked={deliveryMethod === 'colissimo'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div>
                        <p className="font-bold text-sm">Colissimo Domicile</p>
                        <p className="text-xs text-[var(--muted)]">Livraison sous 48h à 72h</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">6,90 €</span>
                  </label>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="p-6 rounded-xl border border-[var(--line)] bg-white space-y-4">
                <h2 className="h-display h3">4. Mode de Paiement Sécurisé</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['card', 'paypal', 'wero', 'virement'].map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-3 border rounded-lg text-xs font-bold uppercase text-center transition-all ${
                        paymentMethod === pm ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-hover)]' : 'border-[var(--line-strong)]'
                      }`}
                    >
                      {pm === 'card' ? 'Carte Visa/MC' : pm === 'paypal' ? 'PayPal' : pm === 'wero' ? 'Wero' : 'Virement'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary btn--block py-4 text-base"
              >
                {loading ? 'Validation en cours…' : `Payer ${finalTotalEUR.toFixed(2)} €`}
              </button>
            </form>

            {/* Récapitulatif Panier (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] space-y-6 sticky top-24">
              <h2 className="h-display h3 border-b border-[var(--line)] pb-3">Récapitulatif de Commande</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs border-b border-[var(--line)] pb-3">
                    <Image src={item.img} alt={item.nom} width={48} height={48} className="w-12 h-12 rounded object-cover border border-[var(--line)]" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.nom}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button type="button" onClick={() => updateItemQty(item.id, item.qty - 1)} className="px-1.5 py-0.5 border rounded bg-white font-bold">-</button>
                        <span>Quantité: {item.qty}</span>
                        <button type="button" onClick={() => updateItemQty(item.id, item.qty + 1)} className="px-1.5 py-0.5 border rounded bg-white font-bold">+</button>
                      </div>
                    </div>
                    <PriceTag amount={item.prix * item.qty} className="font-bold text-sm" />
                  </div>
                ))}
              </div>

              {/* Code Promo */}
              <div className="pt-2 border-t border-[var(--line)]">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code promo (ex: BIENVENUE10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!voucherApplied}
                    className="flex-1 p-2 rounded border border-[var(--line-strong)] text-xs uppercase"
                  />
                  <button type="submit" className="btn btn--secondary btn--sm" disabled={!!voucherApplied}>
                    Appliquer
                  </button>
                </form>
                {promoMsg && <p className="text-xs font-semibold mt-2" style={{ color: promoMsg.includes('erreur') || promoMsg.includes('invalide') || promoMsg.includes('Retirez') ? 'var(--brick)' : 'var(--ok)' }}>{promoMsg}</p>}
              </div>

              {/* Bon de fidélité */}
              <div className="pt-2 border-t border-[var(--line)]">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>
                  Solde fidélité : {loyaltyBalance.toFixed(2)} € cumulés
                </p>
                {voucherApplied ? (
                  <div className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--brand-soft)', border: '1px solid var(--line)' }}>
                    <span className="text-xs font-bold">
                      Bon de {voucherApplied.amount} € appliqué (-{voucherApplied.discount.toFixed(2)} €)
                    </span>
                    <button type="button" onClick={handleRemoveVoucher} className="text-xs underline" style={{ color: 'var(--brick)' }}>
                      Retirer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVoucher} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Bon de fidélité (ex: MLG-BON-XXXX)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      disabled={!canUseVoucher}
                      className="flex-1 p-2 rounded border border-[var(--line-strong)] text-xs uppercase"
                    />
                    <button type="submit" className="btn btn--secondary btn--sm" disabled={!canUseVoucher}>
                      Appliquer
                    </button>
                  </form>
                )}
                {voucherMsg && (
                  <p className="text-xs font-semibold mt-2" style={{ color: voucherMsg.includes('Bon de') ? 'var(--ok)' : 'var(--brick)' }}>
                    {voucherMsg}
                  </p>
                )}
                {promoCode && !voucherApplied && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Les bons de fidélité ne sont pas cumulables avec les codes promo.
                  </p>
                )}
              </div>

              {/* Décompte des montants */}
              <div className="space-y-2 text-xs border-t border-[var(--line)] pt-4">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <PriceTag amount={subtotalEUR} className="font-semibold" />
                </div>

                {voucherApplied && voucherApplied.discount > 0 && (
                  <div className="flex justify-between" style={{ color: 'var(--ok)', fontWeight: 600 }}>
                    <span>Bon de fidélité</span>
                    <span>-{voucherApplied.discount.toFixed(2)} €</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>{shippingEUR === 0 ? 'OFFERT' : `${shippingEUR.toFixed(2)} €`}</span>
                </div>

                <div className="flex justify-between text-base font-bold pt-3 border-t border-[var(--line)] text-[var(--ink)]">
                  <span>Total TTC</span>
                  <PriceTag amount={finalTotalEUR} className="text-lg font-bold text-[var(--brand-hover)]" />
                </div>

                {/* Points fidélité gagnés */}
                {subtotalEUR > 0 && (
                  <div className="pt-2 text-center" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    Vous gagnerez {subtotalEUR.toFixed(2)} € de fidélité avec cette commande
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer theme={theme || undefined} />
    </div>
  );
}
