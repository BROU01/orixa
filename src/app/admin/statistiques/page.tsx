import { getOrderStats } from '@/lib/orders';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
export const dynamic = 'force-dynamic';


const fmtEUR = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

const STATUS_COLOR: Record<string, string> = {
  'En attente': 'var(--a-warn)',
  'Payée': 'var(--a-brand)',
  'Expédiée': '#8B5CF6',
  'Livrée': 'var(--a-ok)',
  'Paiement refusé': 'var(--a-danger)',
  'Remboursée': '#6E7A75',
};

/**
 * Page admin — Statistiques, calculées à partir des vraies commandes
 * enregistrées dans Supabase (table `orders`), plus aucune donnée fictive.
 */
export default async function AdminStatistiquesPage() {
  const stats = await getOrderStats();
  const maxDaily = Math.max(1, ...stats.dailyRevenue.map((d) => d.revenue));
  const statusEntries = Object.entries(stats.statusBreakdown);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h2 className="page-title">Statistiques</h2>
          <p className="page-sub">Vue d&apos;ensemble calculée à partir des commandes réellement enregistrées.</p>
        </div>
      </div>

      {!isSupabaseAdminConfigured && (
        <div className="note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <span>La persistance des commandes n&apos;est pas configurée (SUPABASE_SERVICE_ROLE_KEY manquant) : ces statistiques resteront à zéro tant qu&apos;elle ne l&apos;est pas.</span>
        </div>
      )}

      {stats.orderCount === 0 ? (
        <div className="card">
          <div className="card__body">
            <p style={{ color: 'var(--a-muted)' }}>Aucune commande enregistrée pour le moment. Les statistiques apparaîtront dès la première commande.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid-4" style={{ marginBottom: '24px' }}>
            <div className="kpi">
              <p className="kpi__label">Chiffre d&apos;affaires</p>
              <p className="kpi__value">{fmtEUR(stats.totalRevenue)}</p>
            </div>
            <div className="kpi">
              <p className="kpi__label">Commandes</p>
              <p className="kpi__value">{stats.orderCount}</p>
            </div>
            <div className="kpi">
              <p className="kpi__label">Panier moyen</p>
              <p className="kpi__value">{fmtEUR(stats.averageBasket)}</p>
            </div>
            <div className="kpi">
              <p className="kpi__label">Articles vendus</p>
              <p className="kpi__value">{stats.itemsSold}</p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card__head">
              <h3 className="card__title">Chiffre d&apos;affaires — 7 derniers jours avec commandes</h3>
            </div>
            <div className="card__body">
              <div className="bars">
                {stats.dailyRevenue.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--a-ink)' }}>{fmtEUR(d.revenue)}</span>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', width: '100%', height: '100%' }}>
                      <div className="bar" style={{ height: `${(d.revenue / maxDaily) * 100}%`, flex: 1 }}></div>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--a-muted)' }}>{new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card__head">
                <h3 className="card__title">Commandes par statut</h3>
                <a href="/admin/commandes" className="b b--default b--sm">Voir tout</a>
              </div>
              <div className="card__body">
                <div className="status-grid">
                  {statusEntries.map(([label, count]) => (
                    <a key={label} href="/admin/commandes" className="status-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="status-card__val" style={{ color: STATUS_COLOR[label] || 'var(--a-ink)' }}>{count}</div>
                      <div className="status-card__label">{label}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__head">
                <h3 className="card__title">Top produits vendus</h3>
                <a href="/admin/produits" className="b b--default b--sm">Voir tout</a>
              </div>
              <div className="card__body">
                <div className="rank">
                  {stats.topProducts.map((p, i) => (
                    <div key={i} className="rank__i">
                      <span className={`rank__n ${i < 3 ? 'rank__n--top' : ''}`}>{i + 1}</span>
                      <div className="rank__info">
                        <div className="rank__name">{p.nom}</div>
                        <div className="rank__meta">{p.qty} unités vendues</div>
                      </div>
                      <span className="rank__val">{fmtEUR(p.revenue)}</span>
                    </div>
                  ))}
                  {stats.topProducts.length === 0 && (
                    <p style={{ color: 'var(--a-muted)', fontSize: '13px' }}>Aucun article vendu pour le moment.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
