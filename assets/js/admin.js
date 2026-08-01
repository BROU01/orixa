/* =========================================================
   ORIXA — admin.js
   Couche d'état du back-office. Tout est conservé dans le
   stockage local tant qu'aucun back-end n'est branché.
   ========================================================= */
(function () {
  'use strict';

  const mem = {};
  const Store = {
    get(k, fb) {
      try { const v = localStorage.getItem(k); return v === null ? fb : JSON.parse(v); }
      catch (e) { return k in mem ? mem[k] : fb; }
    },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { delete mem[k]; try { localStorage.removeItem(k); } catch (e) {} }
  };

  const T = window.OrixaTheme;

  /* ---------- Toast ---------- */
  let el = null, timer = null;
  function toast(msg) {
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast-a';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.setAttribute('data-open', 'true');
    clearTimeout(timer);
    timer = setTimeout(function () { el.setAttribute('data-open', 'false'); }, 2600);
  }

  /* ---------- Produits ---------- */
  function products() {
    const s = Store.get('orixa:products', null);
    if (s && Array.isArray(s) && s.length) return s;
    return JSON.parse(JSON.stringify(window.ORIXA_PRODUCTS || []));
  }
  function saveProducts(l) { Store.set('orixa:products', l); }

  /* ---------- Thème / sections / menu ---------- */
  function theme() { return Object.assign({}, T.DEFAULT_THEME, Store.get('orixa:theme', {})); }
  function saveTheme(t) { Store.set('orixa:theme', t); }

  function sections() {
    return Store.get('orixa:sections:v2', JSON.parse(JSON.stringify(T.DEFAULT_SECTIONS)));
  }
  function saveSections(s) { Store.set('orixa:sections:v2', s); }

  function menu() { return Store.get('orixa:menu:v2', JSON.parse(JSON.stringify(T.DEFAULT_MENU))); }
  function saveMenu(m) { Store.set('orixa:menu:v2', m); }

  /* ---------- Médiathèque ---------- */
  // Les visuels livrés avec le projet + les images téléversées (data URL).
  const BUILTIN_MEDIA = [
    'products/cosmetics/beurre-de-karite.jpg', 'products/cosmetics/blush.jpg',
    'products/cosmetics/crayon-a-sourcils-blond.jpg', 'products/cosmetics/faux-cils.jpg',
    'products/cosmetics/faux-ongles.jpg', 'products/cosmetics/gel.jpg',
    'products/cosmetics/mascara.jpg', 'products/cosmetics/masque-facial.jpg',
    'products/cosmetics/parfum.jpg', 'products/cosmetics/pommade.jpg',
    'products/cosmetics/rouge-a-levre.jpg', 'products/cosmetics/vernis-a-ongles.jpg',
    'products/exotic/aklui.jpg', 'products/exotic/attieke.jpg',
    'products/exotic/aubergine-blanche.jpg', 'products/exotic/banane-plantain.jpg',
    'products/exotic/cossete-igname.webp', 'products/exotic/cube-maggi-poulet.jpg',
    'products/exotic/farine-d-haricot.jpg', 'products/exotic/gari.jpeg',
    'products/exotic/gombo-moulu.png', 'products/exotic/gombo.jpg',
    'products/exotic/hibiscus.jpg', 'products/exotic/igname.jpg',
    'products/exotic/koms.jpg', 'products/exotic/manioc.jpg',
    'products/exotic/piments.jpg', 'products/exotic/tapioca.jpeg',
    'assets/img/hero-poster.jpg', 'assets/img/auth-bg.png',
    'assets/img/logo-orixa.svg', 'assets/img/placeholder.svg'
  ];

  function media() {
    const up = Store.get('orixa:media', []);
    return BUILTIN_MEDIA.map(function (src) {
      return { src: src, name: src.split('/').pop(), builtin: true };
    }).concat(up);
  }
  function addMedia(item) {
    const up = Store.get('orixa:media', []);
    up.unshift(item);
    Store.set('orixa:media', up);
  }
  function removeMedia(src) {
    Store.set('orixa:media', Store.get('orixa:media', []).filter(function (m) { return m.src !== src; }));
  }

  /* ---------- Collections ---------- */
  const DEFAULT_COLLECTIONS = [
    { id: 'c_essentiels', titre: 'Les essentiels de la cuisine', slug: 'essentiels', on: true,
      desc: "Ce qu'il faut toujours avoir dans le placard.", ids: ['gari', 'cube-maggi', 'piments', 'gombo-moulu'] },
    { id: 'c_soins', titre: 'Soins au karité', slug: 'karite', on: true,
      desc: 'Notre gamme autour du beurre de karité brut.', ids: ['karite', 'pommade', 'masque-facial'] },
    { id: 'c_bissap', titre: 'Boissons & infusions', slug: 'boissons', on: false,
      desc: 'Bissap, tapioca et bouillies.', ids: ['hibiscus', 'tapioca', 'aklui'] }
  ];
  function collections() { return Store.get('orixa:collections', JSON.parse(JSON.stringify(DEFAULT_COLLECTIONS))); }
  function saveCollections(c) { Store.set('orixa:collections', c); }

  /* ---------- Réductions ---------- */
  const DEFAULT_DISCOUNTS = [
    { id: 'd1', code: 'BIENVENUE10', type: 'pct',  valeur: 10,   min: 0,     actif: true,  usages: 42, limite: 500, fin: '2026-12-31' },
    { id: 'd2', code: 'LIVRAISON',   type: 'liv',  valeur: 0,    min: 100,   actif: true,  usages: 118, limite: 0,  fin: '' },
    { id: 'd3', code: 'KARITE20',    type: 'fixe', valeur: 20,   min: 100,   actif: false, usages: 7,  limite: 100, fin: '2026-08-31' }
  ];
  function discounts() { return Store.get('orixa:discounts', JSON.parse(JSON.stringify(DEFAULT_DISCOUNTS))); }
  function saveDiscounts(d) { Store.set('orixa:discounts', d); }

  /* ---------- Articles ---------- */
  const DEFAULT_ARTICLES = [
    { id: 'a1', titre: 'Comment préparer un bon eba', slug: 'preparer-eba', statut: 'publie',
      date: '2026-07-24', extrait: "La bonne proportion d'eau, la température, le geste du poignet.",
      image: 'products/exotic/gari.jpeg',
      contenu: '<p>Le secret d\'un eba réussi tient à trois choses : la qualité du gari, la température de l\'eau et la vitesse du bras.</p><p>Comptez environ un volume d\'eau bouillante pour un volume et demi de gari.</p>' },
    { id: 'a2', titre: 'Le karité, de la noix au pot', slug: 'karite-noix-pot', statut: 'publie',
      date: '2026-07-11', extrait: 'Nous avons suivi une journée de production au Burkina Faso.',
      image: 'products/cosmetics/beurre-de-karite.jpg',
      contenu: '<p>La noix est concassée, torréfiée, puis broyée à la meule.</p><p>Le barattage à la main peut durer plus d\'une heure.</p>' },
    { id: 'a3', titre: 'Bissap : la recette de la maison', slug: 'bissap-maison', statut: 'brouillon',
      date: '2026-07-29', extrait: 'Gingembre, menthe, et surtout pas trop de sucre.',
      image: 'products/exotic/hibiscus.jpg',
      contenu: '<p>Faites infuser les calices dix minutes, pas plus, sinon l\'amertume prend le dessus.</p>' }
  ];
  function articles() { return Store.get('orixa:articles', JSON.parse(JSON.stringify(DEFAULT_ARTICLES))); }
  function saveArticles(a) { Store.set('orixa:articles', a); }

  /* ---------- Pages CMS ---------- */
  const DEFAULT_PAGES = [
    { id: 'histoire', titre: 'Notre histoire', chapo: "L'histoire d'ORIXA, maison française de cosmétiques et produits exotiques en lien direct avec les producteurs.",
      image: 'assets/img/hero-poster.jpg',
      contenu: '<p>ORIXA est née d\'une conviction simple : les produits de nos producteurs partenaires méritent une filière courte, juste et transparente.</p>' },
    { id: 'contact', titre: 'Nous écrire', chapo: 'Nous répondons du lundi au samedi, de 8 h à 18 h.',
      image: 'assets/img/auth-bg.png',
      contenu: '<p>Une question, une commande à suivre, un partenariat ? Écrivez-nous.</p>' },
    { id: 'legal', titre: 'Informations légales', chapo: 'Mentions légales, CGV, confidentialité et cookies.',
      image: 'assets/img/hero-poster.jpg',
      contenu: '<h2 id="mentions">Mentions légales</h2><p>ORIXA — 12 rue des Lilas, 27200 Vernon, France. SIRET à compléter. Directrice de la publication : Kalipé G. Hébergeur à compléter.</p><h2 id="cgv">Conditions générales de vente</h2><p>Les présentes conditions régissent les ventes conclues sur orixa.fr. Prix en euros, toutes taxes comprises. La commande est ferme à réception du paiement. La livraison est assurée par Mondial Relay dans toute l\'Europe.</p><h2 id="confidentialite">Politique de confidentialité</h2><p>Nous collectons les données strictement nécessaires au traitement des commandes : nom, téléphone, adresse de livraison, e-mail. Ces données ne sont ni vendues ni transmises à des tiers en dehors du transporteur.</p><h2 id="rgpd">Vos droits</h2><p>Vous pouvez demander l\'accès, la rectification ou la suppression de vos données à tout moment depuis votre compte, ou par e-mail au service client.</p><h2 id="cookies">Cookies</h2><p>Le site utilise uniquement le stockage local du navigateur pour conserver votre panier et vos favoris entre deux visites. Aucun cookie publicitaire ni traceur tiers n\'est déposé.</p>' }
  ];
  function pages() { return Store.get('orixa:pages', JSON.parse(JSON.stringify(DEFAULT_PAGES))); }
  function savePages(p) { Store.set('orixa:pages', p); }

  /* ---------- Utilisateurs ---------- */
  const DEFAULT_USERS = [
    { id: 'u1', nom: 'Kalipé G.',    mail: 'k.g@orixa.fr',     role: 'proprietaire', actif: true,  vu: "aujourd'hui" },
    { id: 'u2', nom: 'Marie Lefèvre', mail: 'marie@orixa.fr',  role: 'gestionnaire', actif: true,  vu: 'hier' },
    { id: 'u3', nom: 'Thomas Blanc',  mail: 'thomas@orixa.fr', role: 'preparateur',  actif: true,  vu: 'il y a 3 j' },
    { id: 'u4', nom: 'Léa Petit',     mail: 'lea@orixa.fr',    role: 'lecture',      actif: false, vu: 'il y a 2 mois' }
  ];
  const ROLES = {
    proprietaire: { label: 'Propriétaire',  desc: 'Accès total, y compris la facturation et les utilisateurs.' },
    gestionnaire: { label: 'Gestionnaire',  desc: 'Produits, commandes, thème et contenus. Pas les utilisateurs.' },
    preparateur:  { label: 'Préparateur',   desc: 'Commandes et stock uniquement.' },
    lecture:      { label: 'Lecture seule', desc: 'Consultation des statistiques et des commandes.' }
  };
  function users() { return Store.get('orixa:users', JSON.parse(JSON.stringify(DEFAULT_USERS))); }
  function saveUsers(u) { Store.set('orixa:users', u); }

  /* ---------- Rayons (catégories) CMS ---------- */
  function categories() {
    const s = Store.get('orixa:categories', null);
    if (s && Array.isArray(s) && s.length) return s;
    return JSON.parse(JSON.stringify(window.ORIXA_CATEGORIES || []));
  }
  function saveCategories(c) { Store.set('orixa:categories', c); }

  /* ---------- Export CSV ---------- */
  function exportCSV(rows, cols, filename) {
    const esc = function (v) {
      const s = String(v == null ? '' : v);
      return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const csv = [cols.join(';')].concat(
      rows.map(function (r) { return cols.map(function (c) { return esc(r[c]); }).join(';'); })
    ).join('\n');
    try {
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'export.csv';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast('Export CSV généré');
    } catch (e) { toast('Export impossible dans ce contexte'); }
  }

  /* ---------- Sauvegarde / restauration complète ---------- */
  const KEYS = ['orixa:theme', 'orixa:sections:v2', 'orixa:menu:v2', 'orixa:products',
                'orixa:media', 'orixa:collections', 'orixa:discounts',
                'orixa:articles', 'orixa:pages', 'orixa:users', 'orixa:categories',
                'orixa:settings', 'orixa:orders'];

  function exportAll() {
    const out = { _format: 'orixa-backup', _date: new Date().toISOString() };
    KEYS.forEach(function (k) { out[k] = Store.get(k, null); });
    try {
      const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'orixa-sauvegarde.json';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast('Sauvegarde téléchargée');
    } catch (e) { toast('Sauvegarde impossible'); }
  }

  function importAll(json) {
    let data;
    try { data = JSON.parse(json); } catch (e) { toast('Fichier illisible'); return false; }
    if (!data || data._format !== 'orixa-backup') { toast('Ce fichier n’est pas une sauvegarde ORIXA'); return false; }
    KEYS.forEach(function (k) { if (data[k] !== null && data[k] !== undefined) Store.set(k, data[k]); });
    // Migration des sauvegardes antérieures à la v2 (menu / sections à plat + hero plein écran)
    if (data['orixa:menu'] != null && data['orixa:menu:v2'] == null) Store.set('orixa:menu:v2', data['orixa:menu']);
    if (data['orixa:sections'] != null && data['orixa:sections:v2'] == null) Store.set('orixa:sections:v2', data['orixa:sections']);
    toast('Sauvegarde restaurée');
    return true;
  }

  function resetAll() {
    KEYS.concat(['orixa:cart', 'orixa:favs', 'orixa:menu', 'orixa:sections']).forEach(Store.del);
  }

  /* ---------- Devises disponibles — source unique : window.ORIXA_CURRENCIES (catalog.js) ---------- */
  const CURRENCIES = window.ORIXA_CURRENCIES || [
    { code: 'EUR', symbol: '€',    locale: 'fr-FR', name: 'Euro (EUR)',           rate: 1 },
    { code: 'XOF', symbol: 'FCFA', locale: 'fr-FR', name: 'Franc CFA (XOF)',      rate: 655.957 },
    { code: 'USD', symbol: '$',    locale: 'en-US', name: 'Dollar US (USD)',      rate: 1.09 },
    { code: 'GBP', symbol: '£',    locale: 'en-GB', name: 'Livre Sterling (GBP)', rate: 0.86 },
    { code: 'CHF', symbol: 'CHF',  locale: 'fr-CH', name: 'Franc suisse (CHF)',   rate: 0.94 },
    { code: 'MAD', symbol: 'DH',   locale: 'fr-MA', name: 'Dirham (MAD)',         rate: 10.8 }
  ];

  /* ---------- Réglages généraux ---------- */
  const DEFAULT_SETTINGS = {
    siteName: 'ORIXA',
    siteDesc: 'Cosmétiques & produits exotiques',
    supportEmail: 'bonjour@orixa.fr',
    supportPhone: '+33 6 00 00 00 00',
    address: 'France — livraison dans toute l\'Europe',
    currency: 'EUR',
    currencySymbol: '€',
    currencyPosition: 'after', // 'before' | 'after'
    locale: 'fr-FR',
    shippingLocalName: 'France',
    shippingLocalPrice: 3,
    shippingLocalFreeFrom: 100,
    shippingCountryName: 'Europe (Mondial Relay)',
    shippingCountryPrice: 5,
    shippingCountryDays: '3 à 5 jours',
    taxRate: 20,
    taxLabel: 'TVA',
    orderPrefix: 'ORX-',
    nextOrderNum: 1000,
    socialInstagram: '',
    socialFacebook: '',
    socialTikTok: '',
    googleAnalyticsId: '',
    metaTitleSuffix: '— ORIXA',
    maintenanceMode: false,
    maintenanceMessage: 'Site en maintenance. Revenez bientôt !'
  };

  function settings() {
    return Object.assign({}, DEFAULT_SETTINGS, Store.get('orixa:settings', {}));
  }
  function saveSettings(s) {
    Store.set('orixa:settings', s);
  }

  /* ---------- Formateur de prix avec devise ---------- */
  function formatPrice(amount) {
    const s = settings();
    const curr = CURRENCIES.find(function (c) { return c.code === s.currency; });
    const rate = (curr && curr.rate) || 1;
    const symbol = s.currencySymbol || (curr ? curr.symbol : '€');
    const loc = s.locale || (curr ? curr.locale : 'fr-FR');
    const formatted = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount * rate);
    return s.currencyPosition === 'before' ? symbol + ' ' + formatted : formatted + ' ' + symbol;
  }

  /* ---------- Normalisation (recherche sans accents) ---------- */
  function norm(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  /* ---------- Générateur d'ID unique ---------- */
  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  }

  /* ---------- Sidebar rétractable ---------- */
  function initSidebar() {
    const brand = document.querySelector('.side__brand');
    const root = document.querySelector('.admin');
    if (!brand || !root) return;
    let off = false;
    try { off = localStorage.getItem('orixa:admin-side') === 'off'; } catch (e) {}
    root.setAttribute('data-side', off ? 'off' : 'on');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'side__toggle';
    btn.setAttribute('aria-label', off ? 'Déplier la barre latérale' : 'Replier la barre latérale');
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
    btn.addEventListener('click', function () {
      off = root.getAttribute('data-side') !== 'off';
      root.setAttribute('data-side', off ? 'off' : 'on');
      btn.setAttribute('aria-label', off ? 'Déplier la barre latérale' : 'Replier la barre latérale');
      try { localStorage.setItem('orixa:admin-side', off ? 'off' : 'on'); } catch (e) {}
    });
    brand.appendChild(btn);

    // Accessibilité : en mode replié les liens ne montrent que des icônes
    document.querySelectorAll('.side__link').forEach(function (l) {
      var t = l.textContent.trim();
      if (!l.getAttribute('title')) l.setAttribute('title', t);
      if (!l.getAttribute('aria-label')) l.setAttribute('aria-label', t);
    });
  }

  /* ---------- Init au chargement ---------- */
  function init() {
    initSidebar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.OrixaAdmin = {
    Store: Store, toast: toast, norm: norm, uid: uid,
    products: products, saveProducts: saveProducts,
    theme: theme, saveTheme: saveTheme,
    sections: sections, saveSections: saveSections,
    menu: menu, saveMenu: saveMenu,
    categories: categories, saveCategories: saveCategories,
    media: media, addMedia: addMedia, removeMedia: removeMedia,
    collections: collections, saveCollections: saveCollections,
    discounts: discounts, saveDiscounts: saveDiscounts,
    articles: articles, saveArticles: saveArticles,
    pages: pages, savePages: savePages, DEFAULT_PAGES: DEFAULT_PAGES,
    users: users, saveUsers: saveUsers, ROLES: ROLES,
    CURRENCIES: CURRENCIES,
    settings: settings, saveSettings: saveSettings,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    formatPrice: formatPrice,
    exportCSV: exportCSV, exportAll: exportAll, importAll: importAll, resetAll: resetAll
  };
})();
