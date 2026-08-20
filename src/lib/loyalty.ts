/**
 * ORIXA — Service de fidélité
 *
 * Règles :
 * - 100 € TTC cumulés (hors frais de port) = bon de 10 €
 * - Cumul multi-commandes, reliquat reporté
 * - Un bon par palier complet
 * - Bon non applicable sur frais de port
 * - Bon non remboursable en espèces
 * - Remboursement intégral → annulation du bon non consommé
 * - Validité par défaut : 6 mois
 */

import type { Voucher, LoyaltyBalance, Order } from '@/types';

// ── Constantes ──
const THRESHOLD = 100;          // Palier en €
const VOUCHER_AMOUNT = 10;      // Montant du bon en €
const VOUCHER_VALIDITY_MONTHS = 6; // Durée de validité en mois
const STORAGE_KEY_BALANCE = 'orixa:loyalty:balance';
const STORAGE_KEY_ORDERS = 'orixa:orders';

// ── Utilitaires ──

function generateId(): string {
  return `LOY-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateVoucherCode(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORIXA-BON-${suffix}`;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ── Persistance localStorage ──

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getStoredBalance(): LoyaltyBalance {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BALANCE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch { /* ignore */ }

  return {
    cumulativeSpend: 0,
    remainder: 0,
    vouchers: [],
    nextThreshold: THRESHOLD,
  };
}

function saveBalance(balance: LoyaltyBalance): void {
  try {
    localStorage.setItem(STORAGE_KEY_BALANCE, JSON.stringify(balance));
  } catch { /* ignore */ }
}

// ── Calcul de fidélité après paiement ──

/**
 * Appelé après qu'une commande est marquée comme payée.
 * Calcule les nouveaux paliers et génère les bons correspondants.
 *
 * @param orderTotalSubtotal - Montant TTC des articles (hors frais de port)
 * @param orderId - Identifiant de la commande
 * @returns Les vouchers générés (peut être vide, un, ou plusieurs)
 */
export function processOrderForLoyalty(
  orderTotalSubtotal: number,
  orderId: string,
): Voucher[] {
  const balance = getStoredBalance();

  // Ajouter le montant de la commande au cumul
  balance.cumulativeSpend += orderTotalSubtotal;

  // Calculer le total disponible (cumul + reliquat précédent)
  const totalAvailable = balance.remainder + orderTotalSubtotal;

  // Combien de paliers complets on atteint ?
  const newVouchersCount = Math.floor(totalAvailable / THRESHOLD);

  const generatedVouchers: Voucher[] = [];

  for (let i = 0; i < newVouchersCount; i++) {
    const now = new Date();
    const voucher: Voucher = {
      id: generateId(),
      code: generateVoucherCode(),
      amount: VOUCHER_AMOUNT,
      generatedAt: nowISO(),
      expiresAt: addMonths(now, VOUCHER_VALIDITY_MONTHS).toISOString(),
      consumed: false,
      orderId,
      refunded: false,
    };
    generatedVouchers.push(voucher);
    balance.vouchers.push(voucher);
  }

  // Mettre à jour le reliquat
  balance.remainder = totalAvailable - (newVouchersCount * THRESHOLD);

  // Calculer le prochain palier
  balance.nextThreshold = balance.cumulativeSpend + (THRESHOLD - balance.remainder);

  saveBalance(balance);

  return generatedVouchers;
}

// ── Valider et appliquer un bon d'achat ──

export interface VoucherValidation {
  valid: boolean;
  error?: string;
  voucher?: Voucher;
}

/**
 * Valide un code de bon d'achat.
 * - Le bon doit exister, ne pas être consommé, ne pas être expiré
 * - Le bon ne peut pas être utilisé sur les frais de port
 * - Le bon n'est pas remboursable en espèces
 */
export function validateVoucher(code: string): VoucherValidation {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Veuillez saisir un code de bon d\'achat.' };
  }

  const balance = getStoredBalance();
  const cleanCode = code.trim().toUpperCase();

  const voucher = balance.vouchers.find(
    (v) => v.code === cleanCode && !v.consumed && !v.refunded,
  );

  if (!voucher) {
    return { valid: false, error: 'Ce code de bon d\'achat n\'est pas valide.' };
  }

  // Vérifier l'expiration
  if (new Date(voucher.expiresAt) < new Date()) {
    const expDate = new Date(voucher.expiresAt);
    const formatted = `${expDate.getDate().toString().padStart(2, '0')}/${(expDate.getMonth() + 1).toString().padStart(2, '0')}/${expDate.getFullYear()}`;
    return { valid: false, error: `Ce bon a expiré le ${formatted}.` };
  }

  return { valid: true, voucher };
}

/**
 * Applique un bon d'achat au panier.
 * Le bon réduit le sous-total (articles), JAMAIS les frais de port.
 *
 * @param subtotal - Sous-total des articles (hors port)
 * @param shipping - Frais de port
 * @param voucherId - ID du bon à appliquer
 * @returns Montant réduit et nouveau total
 */
export function applyVoucher(
  subtotal: number,
  shipping: number,
  voucherId: string,
): { discountAmount: number; finalSubtotal: number; finalTotal: number } {
  const balance = getStoredBalance();
  const voucher = balance.vouchers.find((v) => v.id === voucherId && !v.consumed && !v.refunded);

  if (!voucher) {
    return { discountAmount: 0, finalSubtotal: subtotal, finalTotal: subtotal + shipping };
  }

  // Le bon s'applique sur le sous-total uniquement (pas le port)
  const discountAmount = Math.min(voucher.amount, subtotal);
  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const finalTotal = finalSubtotal + shipping;

  return { discountAmount, finalSubtotal, finalTotal };
}

/**
 * Marque un bon comme consommé après validation de la commande.
 */
export function consumeVoucher(voucherId: string, orderId: string): void {
  const balance = getStoredBalance();
  const voucher = balance.vouchers.find((v) => v.id === voucherId);
  if (voucher) {
    voucher.consumed = true;
    voucher.consumedAt = nowISO();
    saveBalance(balance);
  }
}

// ── Remboursement ──

/**
 * Quand une commande est intégralement remboursée,
 * annule les bons non consommés générés par cette commande
 * et débite le compteur du montant correspondant.
 */
export function handleRefund(orderId: string): { cancelledVouchers: number; amountDebited: number } {
  const balance = getStoredBalance();

  // Trouver les bons générés par cette commande qui n'ont pas été consommés
  const vouchersToCancel = balance.vouchers.filter(
    (v) => v.orderId === orderId && !v.consumed && !v.refunded,
  );

  let amountDebited = 0;

  for (const voucher of vouchersToCancel) {
    voucher.refunded = true;
    amountDebited += voucher.amount;
  }

  // Débiter le compteur
  balance.cumulativeSpend = Math.max(0, balance.cumulativeSpend - amountDebited);

  // Recalculer le reliquat
  const totalSpent = balance.cumulativeSpend;
  const vouchersConsumed = balance.vouchers.filter(
    (v) => v.consumed && !v.refunded,
  ).length;
  balance.remainder = totalSpent - (vouchersConsumed * THRESHOLD);
  if (balance.remainder < 0) balance.remainder = 0;

  // Recalculer le prochain palier
  const nextComplete = Math.ceil(balance.cumulativeSpend / THRESHOLD) * THRESHOLD;
  balance.nextThreshold = nextComplete <= balance.cumulativeSpend
    ? balance.cumulativeSpend + THRESHOLD
    : nextComplete;

  saveBalance(balance);

  return {
    cancelledVouchers: vouchersToCancel.length,
    amountDebited,
  };
}

// ── Solde pour affichage ──

export function getLoyaltyDisplay(): {
  cumulativeSpend: number;
  remainder: number;
  availableVouchers: Voucher[];
  nextThreshold: number;
  progress: number; // 0-1 pourcentage vers le prochain palier
} {
  const balance = getStoredBalance();

  const now = new Date();
  const availableVouchers = balance.vouchers.filter(
    (v) => !v.consumed && !v.refunded && new Date(v.expiresAt) > now,
  );

  const progress = balance.nextThreshold > 0
    ? Math.min(1, balance.cumulativeSpend / balance.nextThreshold)
    : 0;

  return {
    cumulativeSpend: balance.cumulativeSpend,
    remainder: balance.remainder,
    availableVouchers,
    nextThreshold: balance.nextThreshold,
    progress,
  };
}

// ── Constantes exportées pour l'UI ──
export const LOYALTY_CONFIG = {
  THRESHOLD,
  VOUCHER_AMOUNT,
  VOUCHER_VALIDITY_MONTHS,
} as const;
