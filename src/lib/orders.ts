import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export interface OrderItemInput {
  id: string;
  nom: string;
  prix: number;
  qty: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: string;
  paymentMethod: string;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode?: string;
}

export interface OrderRow {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  delivery_method: string;
  payment_method: string;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promo_code: string | null;
  status: string;
}

export const ORDER_STATUSES = ['En attente', 'Payée', 'Expédiée', 'Livrée', 'Paiement refusé', 'Remboursée'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

function generateOrderRef(): string {
  return `MLG-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Enregistre une commande dans Supabase. Ne lève jamais si Supabase n'est
 * pas configuré : retourne `persisted: false` pour que l'appelant sache que
 * la commande n'a été confirmée que côté client (dégradation explicite,
 * jamais silencieuse au niveau de l'API).
 */
export async function createOrder(input: CreateOrderInput): Promise<{ id: string; persisted: boolean }> {
  const id = generateOrderRef();

  if (!isSupabaseAdminConfigured) {
    return { id, persisted: false };
  }

  const { error } = await supabaseAdmin.from('orders').insert({
    id,
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    customer_phone: input.customerPhone || null,
    address: input.address,
    city: input.city,
    postal_code: input.postalCode,
    country: input.country,
    delivery_method: input.deliveryMethod,
    payment_method: input.paymentMethod,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    discount: input.discount,
    total: input.total,
    promo_code: input.promoCode || null,
    status: 'En attente',
  });

  if (error) {
    return { id, persisted: false };
  }
  return { id, persisted: true };
}

export async function listOrders(): Promise<OrderRow[]> {
  if (!isSupabaseAdminConfigured) return [];
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as OrderRow[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (!isSupabaseAdminConfigured) return false;
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export interface OrderStats {
  totalRevenue: number;
  orderCount: number;
  averageBasket: number;
  itemsSold: number;
  statusBreakdown: Record<string, number>;
  topProducts: Array<{ nom: string; qty: number; revenue: number }>;
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
}

/** Calcule les statistiques réelles à partir des commandes enregistrées. */
export async function getOrderStats(): Promise<OrderStats> {
  const orders = await listOrders();

  const statusBreakdown: Record<string, number> = {};
  const productTotals = new Map<string, { qty: number; revenue: number }>();
  const dailyTotals = new Map<string, { revenue: number; orders: number }>();
  let totalRevenue = 0;
  let itemsSold = 0;

  for (const order of orders) {
    totalRevenue += Number(order.total) || 0;
    statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;

    const day = order.created_at.slice(0, 10);
    const dayEntry = dailyTotals.get(day) || { revenue: 0, orders: 0 };
    dayEntry.revenue += Number(order.total) || 0;
    dayEntry.orders += 1;
    dailyTotals.set(day, dayEntry);

    for (const item of order.items || []) {
      itemsSold += item.qty;
      const entry = productTotals.get(item.nom) || { qty: 0, revenue: 0 };
      entry.qty += item.qty;
      entry.revenue += item.prix * item.qty;
      productTotals.set(item.nom, entry);
    }
  }

  const topProducts = Array.from(productTotals.entries())
    .map(([nom, v]) => ({ nom, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const dailyRevenue = Array.from(dailyTotals.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  return {
    totalRevenue,
    orderCount: orders.length,
    averageBasket: orders.length > 0 ? totalRevenue / orders.length : 0,
    itemsSold,
    statusBreakdown,
    topProducts,
    dailyRevenue,
  };
}

export interface CustomerSummary {
  name: string;
  email: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

/** Dérive la liste des clients à partir de l'historique des commandes. */
export async function listCustomersFromOrders(): Promise<CustomerSummary[]> {
  const orders = await listOrders();
  const byEmail = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const existing = byEmail.get(order.customer_email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(order.total) || 0;
      if (order.created_at > existing.lastOrderAt) {
        existing.lastOrderAt = order.created_at;
        existing.city = order.city;
        existing.name = order.customer_name;
      }
    } else {
      byEmail.set(order.customer_email, {
        name: order.customer_name,
        email: order.customer_email,
        city: order.city,
        orderCount: 1,
        totalSpent: Number(order.total) || 0,
        lastOrderAt: order.created_at,
      });
    }
  }

  return Array.from(byEmail.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}
