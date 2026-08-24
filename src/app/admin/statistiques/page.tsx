'use client';

import { useState } from 'react';

/* ── Données de démonstration ── */
const KPI = {
  ca: { value: '1 284 500', unit: 'FCFA', delta: '+12,4%', up: true, label: 'vs 30 j préc.' },
  commandes: { value: '186', delta: '+8,1%', up: true, label: 'vs 30 j préc.' },
  panier: { value: '6 906', unit: 'FCFA', delta: '−2,3%', up: false, label: 'vs 30 j préc.' },
  conversion: { value: '3,2%', delta: '+0,4%', up: true, label: 'vs 30 j préc.' },
  clients: { value: '142', delta: '+15', up: true, label: 'nouveaux' },
  produitsVendus: { value: '487', delta: '+62', up: true, label: 'unités' },
  annulation: { value: '4,8%', delta: '−1,2%', up: true, label: 'vs 30 j préc.' },
  marge: { value: '486 200', unit: 'FCFA', delta: '+9,1%', up: true, label: 'marge brute' },
};

const EVOLUTION = [
  { day: 'Lun', ca: 145000, cmd: 21 },
  { day: 'Mar', ca: 168000, cmd: 24 },
  { day: 'Mer', ca: 132000, cmd: 19 },
  { day: 'Jeu', ca: 195000, cmd: 28 },
  { day: 'Ven', ca: 210000, cmd: 31 },
  { day: 'Sam', ca: 178000, cmd: 26 },
  { day: 'Dim', ca: 124000, cmd: 18 },
];
const MAX_CA = Math.max(...EVOLUTION.map(e => e.ca));

const CMD_STATUT = [
  { label: 'En attente', count: 12, color: 'var(--a-warn)' },
  { label: 'Confirmées', count: 18, color: 'var(--a-brand)' },
  { label: 'En préparation', count: 8, color: '#3B82F6' },
  { label: 'Expédiées', count: 15, color: '#8B5CF6' },
  { label: 'Livrées', count: 128, color: 'var(--a-ok)' },
  { label: 'Annulées', count: 9, color: 'var(--a-danger)' },
  { label: 'Remboursées', count: 3, color: '#6E7A75' },
];
const TOTAL_CMD = CMD_STATUT.reduce((a, c) => a + c.count, 0);

const TOP_PROD = [
  { nom: 'Beurre de karité pur', ventes: 89, ca: 267000, img: '/products/karite.jpg' },
  { nom: 'Gari grillé premium', ventes: 76, ca: 152000, img: '/products/gari.jpg' },
  { nom: 'Hibiscus séché bio', ventes: 64, ca: 192000, img: '/products/hibiscus.jpg' },
  { nom: 'Savon noir au lait', ventes: 52, ca: 156000, img: '/products/savon.jpg' },
  { nom: 'Huile de coco vierge', ventes: 48, ca: 144000, img: '/products/coco.jpg' },
];

const STOCK_ALERTES = [
  { nom: 'Igname fléchée', stock: 0, status: 'rupture' },
  { nom: 'Piment oiseau', stock: 3, status: 'critique' },
  { nom: 'Noix de cola', stock: 8, status: 'faible' },
  { nom: 'Gombo séché', stock: 12, status: 'faible' },
  { nom: 'Margousier huile', stock: 18, status: 'faible' },
];

const CLIENTS_KPI = {
  nouveaux: 15,
  recurrents: 42,
  tauxReachat: '29,6%',
  repartition: [
    { zone: 'Paris / Île-de-France', pct: 34 },
    { zone: 'Lyon / Auvergne', pct: 18 },
    { zone: 'Bordeaux / Nouvelle-Aquitaine', pct: 14 },
    { zone: 'Marseille / PACA', pct: 12 },
    { zone: 'Nantes / Pays de la Loire', pct: 10 },
    { zone: 'Autres', pct: 12 },
  ],
};

const PERIODS = ['7 jours', '30 jours', '3 mois', '12 mois'];

export default function AdminStatistiquesPage() {
  const [period, setPeriod] = useState('30 jours');

  return (
    <div className="content">
      {/* ── En-tête + filtres ── */}
      <div className="page-head">
        <div>
          <h2 className="page-title">Statistiques</h2>
          <p className="page-sub">Vue d&apos;ensemble de la performance de la boutique.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            {PERIODS.map(p => (
              <button
                key={p}
                className="filter-pill"
                aria-current={period === p ? 'true' : undefined}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="b b--default b--sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Exporter CSV
          </button>
        </div>
      </div>

      {/* ── KPI principaux (8 cartes) ── */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="kpi">
          <p className="kpi__label">Chiffre d&apos;affaires</p>
          <p className="kpi__value">{KPI.ca.value} <span style={{ fontSize: '14px', fontWeight: 600 }}>{KPI.ca.unit}</span></p>
          <p className="kpi__delta kpi__delta--up">{KPI.ca.delta} <span className="kpi__note">{KPI.ca.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Commandes</p>
          <p className="kpi__value">{KPI.commandes.value}</p>
          <p className="kpi__delta kpi__delta--up">{KPI.commandes.delta} <span className="kpi__note">{KPI.commandes.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Panier moyen</p>
          <p className="kpi__value">{KPI.panier.value} <span style={{ fontSize: '14px', fontWeight: 600 }}>{KPI.panier.unit}</span></p>
          <p className="kpi__delta kpi__delta--down">{KPI.panier.delta} <span className="kpi__note">{KPI.panier.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Taux de conversion</p>
          <p className="kpi__value">{KPI.conversion.value}</p>
          <p className="kpi__delta kpi__delta--up">{KPI.conversion.delta} <span className="kpi__note">{KPI.conversion.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Clients actifs</p>
          <p className="kpi__value">{KPI.clients.value}</p>
          <p className="kpi__delta kpi__delta--up">{KPI.clients.delta} <span className="kpi__note">{KPI.clients.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Produits vendus</p>
          <p className="kpi__value">{KPI.produitsVendus.value}</p>
          <p className="kpi__delta kpi__delta--up">{KPI.produitsVendus.delta} <span className="kpi__note">{KPI.produitsVendus.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Taux d&apos;annulation</p>
          <p className="kpi__value">{KPI.annulation.value}</p>
          <p className="kpi__delta kpi__delta--up">{KPI.annulation.delta} <span className="kpi__note">{KPI.annulation.label}</span></p>
        </div>
        <div className="kpi">
          <p className="kpi__label">Marge estimée</p>
          <p className="kpi__value">{KPI.marge.value} <span style={{ fontSize: '14px', fontWeight: 600 }}>FCFA</span></p>
          <p className="kpi__delta kpi__delta--up">{KPI.marge.delta} <span className="kpi__note">{KPI.marge.label}</span></p>
        </div>
      </div>

      {/* ── Graphique évolution ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card__head">
          <h3 className="card__title">Évolution du chiffre d&apos;affaires</h3>
          <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--a-brand)' }}></span>
              CA
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--a-ok)', opacity: '.45' }}></span>
              Commandes
            </span>
          </div>
        </div>
        <div className="card__body">
          <div className="bars">
            {EVOLUTION.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--a-ink)' }}>{(d.ca / 1000).toFixed(0)}k</span>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', width: '100%', height: '100%' }}>
                  <div className="bar" style={{ height: `${(d.ca / MAX_CA) * 100}%`, flex: 1 }}></div>
                  <div className="bar bar--light" style={{ height: `${(d.cmd / 31) * 100}%`, flex: 1 }}></div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--a-muted)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Commandes par statut + Top produits ── */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Commandes par statut */}
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Commandes par statut</h3>
            <a href="/admin/commandes" className="b b--default b--sm">Voir tout</a>
          </div>
          <div className="card__body">
            <div className="status-grid" style={{ marginBottom: '18px' }}>
              {CMD_STATUT.map((s, i) => (
                <a key={i} href="/admin/commandes" className="status-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="status-card__val" style={{ color: s.color }}>{s.count}</div>
                  <div className="status-card__label">{s.label}</div>
                </a>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--a-muted)', borderTop: '1px solid var(--a-line)', paddingTop: '10px' }}>
              <strong>{TOTAL_CMD}</strong> commandes au total · Délai moyen de traitement : <strong>2,4h</strong>
            </div>
          </div>
        </div>

        {/* Top produits */}
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Top 5 — Produits les plus vendus</h3>
            <a href="/admin/produits" className="b b--default b--sm">Voir tout</a>
          </div>
          <div className="card__body">
            <div className="rank">
              {TOP_PROD.map((p, i) => (
                <div key={i} className="rank__i">
                  <span className={`rank__n ${i < 3 ? 'rank__n--top' : ''}`}>{i + 1}</span>
                  <img className="rank__img" src={p.img} alt={p.nom} />
                  <div className="rank__info">
                    <div className="rank__name">{p.nom}</div>
                    <div className="rank__meta">{p.ventes} unités vendues</div>
                  </div>
                  <span className="rank__val">{p.ca.toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stock + Clients ── */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Stock à surveiller */}
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Stock à surveiller</h3>
            <a href="/admin/inventaire" className="b b--default b--sm">Gérer</a>
          </div>
          <div className="card__body">
            {STOCK_ALERTES.map((p, i) => (
              <div key={i} className="hbar">
                <span className="hbar__label">{p.nom}</span>
                <div className="hbar__track">
                  <div
                    className="hbar__fill"
                    style={{
                      width: `${Math.min(p.stock / 50 * 100, 100)}%`,
                      background: p.stock === 0 ? 'var(--a-danger)' : p.stock < 10 ? 'var(--a-warn)' : 'var(--a-ok)',
                    }}
                  />
                </div>
                <span className="hbar__val">
                  {p.stock === 0 ? (
                    <span className="pill pill--danger">Rupture</span>
                  ) : (
                    <span style={{ color: p.stock < 10 ? 'var(--a-warn)' : 'var(--a-ink)' }}>{p.stock} u.</span>
                  )}
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--a-line)', paddingTop: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--a-muted)' }}>
              <strong>3</strong> produits sous le seuil d&apos;alerte · Valeur du stock estimée : <strong>2 450 000 FCFA</strong>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Aperçu clients</h3>
            <a href="/admin/clients" className="b b--default b--sm">Voir tout</a>
          </div>
          <div className="card__body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ textAlign: 'center', padding: '10px', background: 'var(--a-bg)', borderRadius: 'var(--a-r)' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--a-ok)' }}>{CLIENTS_KPI.nouveaux}</div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginTop: '2px' }}>Nouveaux</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', background: 'var(--a-bg)', borderRadius: 'var(--a-r)' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--a-brand)' }}>{CLIENTS_KPI.recurrents}</div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginTop: '2px' }}>Récurrents</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', background: 'var(--a-bg)', borderRadius: 'var(--a-r)' }}>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{CLIENTS_KPI.tauxReachat}</div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginTop: '2px' }}>Taux réachat</div>
              </div>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--a-muted)', marginBottom: '8px' }}>
              Répartition géographique
            </p>
            {CLIENTS_KPI.repartition.map((z, i) => (
              <div key={i} className="hbar">
                <span className="hbar__label" style={{ width: '160px' }}>{z.zone}</span>
                <div className="hbar__track">
                  <div className="hbar__fill" style={{ width: `${z.pct}%`, background: 'var(--a-brand)' }} />
                </div>
                <span className="hbar__val">{z.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Marketing + Opérationnels ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Marketing & promotions</h3>
            <a href="/admin/reductions" className="b b--default b--sm">Réductions</a>
          </div>
          <div className="card__body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Ventes avec réduction</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>38 <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--a-muted)' }}>commandes</span></div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Panier moyen avec code</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>8 240 <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--a-muted)' }}>FCFA</span></div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Montant total des remises</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--a-danger)' }}>−96 500 <span style={{ fontSize: '12px', fontWeight: 400 }}>FCFA</span></div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Code le plus performant</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  <code style={{ padding: '2px 6px', background: 'rgba(201,168,76,0.1)', borderRadius: '4px', fontSize: '12px' }}>BIENVENUE10</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Indicateurs opérationnels</h3>
          </div>
          <div className="card__body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Délai moyen de préparation</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>2,4 <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--a-muted)' }}>heures</span></div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Délai moyen de livraison</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>3,1 <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--a-muted)' }}>jours</span></div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Taux de livraison réussie</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--a-ok)' }}>96,8%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Taux de retour</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>2,1%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Commandes nécessitant une action</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--a-warn)' }}>5</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--a-muted)', marginBottom: '4px' }}>Temps moyen de réponse</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>1,8 <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--a-muted)' }}>heures</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
