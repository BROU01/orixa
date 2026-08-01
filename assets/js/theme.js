/* =========================================================
   ORIXA — Moteur de thème (CMS)
   Définit les types de sections, leurs réglages, et le rendu.
   Partagé par le front (rendu) et l'admin (édition).
   Ajouter un type ici le rend automatiquement éditable
   dans l'administration : les formulaires sont générés
   à partir du schéma « fields ».
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- Utilitaires ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }
  function uid(p) { return (p || 's') + '_' + Math.random().toString(36).slice(2, 8); }

  /* ---------------- Schéma des sections ---------------- */
  const TYPES = {

    hero: {
      label: 'Bannière principale',
      desc: 'Vidéo ou image plein cadre avec titre et boutons.',
      fields: [
        { k: 'eyebrow',  t: 'text',     label: 'Surtitre' },
        { k: 'title',    t: 'textarea', label: 'Titre', rows: 2 },
        { k: 'text',     t: 'textarea', label: 'Texte', rows: 3 },
        { k: 'cta',      t: 'text',     label: 'Bouton principal' },
        { k: 'ctaHref',  t: 'link',     label: 'Lien du bouton principal' },
        { k: 'cta2',     t: 'text',     label: 'Bouton secondaire' },
        { k: 'cta2Href', t: 'link',     label: 'Lien du bouton secondaire' },
        { k: 'media',    t: 'select',   label: 'Type de média', options: [['video', 'Vidéo'], ['image', 'Image']] },
        { k: 'video',    t: 'video',    label: 'Fichier vidéo', when: { media: 'video' } },
        { k: 'image',    t: 'media',    label: 'Image', when: { media: 'image' } },
        { k: 'overlay',  t: 'range',    label: 'Assombrissement', min: 0, max: 90, step: 5, suffix: '%' },
        { k: 'height',   t: 'select',   label: 'Hauteur', options: [['s', 'Compacte'], ['m', 'Moyenne'], ['l', 'Grande'], ['full', 'Plein écran']] },
        { k: 'align',    t: 'select',   label: 'Alignement', options: [['left', 'Gauche'], ['center', 'Centré']] }
      ],
      defaults: {
        eyebrow: 'France · Europe',
        title: "L'authenticité à l'état pur",
        text: "Cosmétiques naturels et produits exotiques sélectionnés avec soin, livrés partout en Europe depuis notre atelier.",
        cta: 'Voir la boutique', ctaHref: 'boutique.html',
        cta2: 'Notre histoire', cta2Href: 'histoire.html',
        media: 'video', video: 'assets/video/hero.mp4', image: 'assets/img/hero-poster.jpg',
        overlay: 45, height: 'full', align: 'left'
      },
      render: function (s, ctx) {
        const h = { s: '380px', m: '520px', l: 'clamp(460px,74vh,660px)', full: '100svh' }[s.height] || '520px';
        const o = (s.overlay || 0) / 100;
        const media = s.media === 'image'
          ? '<img src="' + ctx.p(s.image) + '" alt="" width="1920" height="1080">'
          : '<video autoplay muted loop playsinline poster="' + ctx.p('assets/img/hero-poster.jpg') + '">' +
            '<source src="' + ctx.p(s.video) + '" type="video/mp4"></video>';
        return '<section class="hero" style="min-height:' + h + '">' +
          '<div class="hero__media" style="--ov:' + o + '">' + media + '</div>' +
          '<div class="hero__inner' + (s.align === 'center' ? ' hero__inner--center' : '') + '">' +
            (s.eyebrow ? '<span class="eyebrow">' + esc(s.eyebrow) + '</span>' : '') +
            (s.title ? '<h1 class="h-display h1 hero__title">' + nl2br(s.title) + '</h1>' : '') +
            (s.text ? '<p class="hero__text">' + nl2br(s.text) + '</p>' : '') +
            ((s.cta || s.cta2) ? '<div class="hero__cta">' +
              (s.cta ? '<a class="btn btn--light" href="' + esc(s.ctaHref) + '">' + esc(s.cta) + '</a>' : '') +
              (s.cta2 ? '<a class="btn btn--outline-light" href="' + esc(s.cta2Href) + '">' + esc(s.cta2) + '</a>' : '') +
            '</div>' : '') +
          '</div></section>';
      }
    },

    categories: {
      label: 'Grille de rayons',
      desc: 'Les rayons du catalogue en cartes.',
      fields: [
        { k: 'eyebrow', t: 'text', label: 'Surtitre' },
        { k: 'title',   t: 'text', label: 'Titre' },
        { k: 'linkText',t: 'text', label: 'Lien à droite' },
        { k: 'linkHref',t: 'link', label: 'Cible du lien' },
        { k: 'showCount', t: 'toggle', label: 'Afficher le nombre de produits' }
      ],
      defaults: { eyebrow: 'Rayons', title: 'Parcourir le catalogue', linkText: 'Tout voir', linkHref: 'boutique.html', showCount: true },
      render: function (s, ctx) {
        const cards = (ctx.categories || []).map(function (c) {
          const n = (ctx.products || []).filter(function (p) { return p.cat === c.id; }).length;
          const page = c.id === 'cosmetiques' ? 'cosmetiques.html'
            : c.id === 'exotiques' ? 'exotiques.html'
            : 'rayon.html?id=' + c.id;
          return '<a class="cat-card" href="' + ctx.p(page) + '">' +
            '<div><p class="cat-card__label">' + esc(c.label) + '</p>' +
            '<p class="cat-card__desc">' + esc(c.desc) + '</p></div>' +
            (s.showCount ? '<p class="cat-card__count">' + n + ' produits</p>' : '') + '</a>';
        }).join('');
        return '<section class="section section--tight"><div class="wrap">' +
          ctx.head(s) + '<div class="cat-grid">' + cards + '</div></div></section>';
      }
    },

    products: {
      label: 'Grille de produits',
      desc: 'Une sélection de produits du catalogue.',
      fields: [
        { k: 'eyebrow', t: 'text', label: 'Surtitre' },
        { k: 'title',   t: 'text', label: 'Titre' },
        { k: 'linkText',t: 'text', label: 'Lien à droite' },
        { k: 'linkHref',t: 'link', label: 'Cible du lien' },
        { k: 'source',  t: 'select', label: 'Sélection', options: [['manual', 'Produits choisis'], ['cat', 'Un rayon entier'], ['new', 'Nouveautés'], ['low', 'Prix les plus bas'], ['all', 'Tout le catalogue']] },
        { k: 'ids',     t: 'products', label: 'Produits', when: { source: 'manual' } },
        { k: 'cat',     t: 'category', label: 'Rayon', when: { source: 'cat' } },
        { k: 'limit',   t: 'range', label: 'Nombre maximum', min: 2, max: 12, step: 1 },
        { k: 'cols',    t: 'select', label: 'Colonnes (ordinateur)', options: [['3', '3'], ['4', '4'], ['5', '5']] }
      ],
      defaults: { eyebrow: 'Les plus commandés', title: 'Ce que nos clients reprennent', linkText: 'Voir tout', linkHref: 'boutique.html', source: 'manual', ids: ['karite', 'parfum', 'attieke', 'hibiscus', 'banane-plantain'], cat: 'cosmetiques', limit: 5, cols: '5' },
      render: function (s, ctx) {
        let list = (ctx.products || []).slice();
        if (s.source === 'manual') {
          list = (s.ids || []).map(function (id) { return list.find(function (p) { return p.id === id; }); }).filter(Boolean);
        } else if (s.source === 'cat') {
          list = list.filter(function (p) { return p.cat === s.cat; });
        } else if (s.source === 'new') {
          list = list.filter(function (p) { return p.badge === 'Nouveau'; }).concat(list).filter(function (v, i, a) { return a.indexOf(v) === i; });
        } else if (s.source === 'low') {
          list.sort(function (a, b) { return a.prix - b.prix; });
        }
        list = list.slice(0, s.limit || 5);
        const min = { '3': '280px', '4': '250px', '5': '210px' }[s.cols] || '230px';
        return '<section class="section section--tight"><div class="wrap">' + ctx.head(s) +
          '<div class="prod-grid" style="grid-template-columns:repeat(auto-fill,minmax(' + min + ',1fr))">' +
          list.map(ctx.card).join('') + '</div></div></section>';
      }
    },

    features: {
      label: 'Points forts',
      desc: 'Trois à quatre arguments en colonnes.',
      fields: [
        { k: 'eyebrow', t: 'text', label: 'Surtitre' },
        { k: 'title',   t: 'text', label: 'Titre' },
        { k: 'items',   t: 'repeat', label: 'Arguments', item: [
            { k: 'title', t: 'text', label: 'Titre' },
            { k: 'text',  t: 'textarea', label: 'Texte', rows: 3 }
          ], max: 4 }
      ],
      defaults: {
        eyebrow: 'Nos engagements', title: 'Pourquoi acheter chez nous',
        items: [
          { title: 'Achat direct', text: "Nous achetons aux coopératives et producteurs, sans intermédiaire." },
          { title: 'Provenance affichée', text: "Chaque produit porte son origine, pas un vague « produit exotique »." },
          { title: 'Livraison Europe', text: "Mondial Relay dans toute l'Europe, offerte dès 100 € d'achat." }
        ]
      },
      render: function (s, ctx) {
        return '<section class="section section--tight"><div class="wrap">' + ctx.head(s) +
          '<div class="cat-grid">' + (s.items || []).map(function (i) {
            return '<div class="cat-card"><div><p class="cat-card__label">' + esc(i.title) + '</p>' +
              '<p class="cat-card__desc">' + nl2br(i.text) + '</p></div></div>';
          }).join('') + '</div></div></section>';
      }
    },

    richtext: {
      label: 'Texte libre',
      desc: 'Un bloc de texte avec titre.',
      fields: [
        { k: 'eyebrow', t: 'text', label: 'Surtitre' },
        { k: 'title',   t: 'text', label: 'Titre' },
        { k: 'body',    t: 'textarea', label: 'Texte', rows: 6 },
        { k: 'align',   t: 'select', label: 'Alignement', options: [['left', 'Gauche'], ['center', 'Centré']] },
        { k: 'bg',      t: 'select', label: 'Fond', options: [['none', 'Aucun'], ['paper', 'Papier'], ['brand', 'Or de marque']] }
      ],
      defaults: { eyebrow: '', title: 'Une maison qui remonte jusqu’à la source', body: "Entre la productrice de karité du Burkina Faso et le pot qui arrive chez vous, il y avait plusieurs intermédiaires et aucune traçabilité. Nous les avons supprimés.", align: 'left', bg: 'paper' },
      render: function (s) {
        const style = s.bg === 'paper' ? 'background:var(--paper-2);' : (s.bg === 'brand' ? 'background:var(--brand);color:var(--paper);' : '');
        const wrapStyle = s.align === 'center' ? 'text-align:center;margin-inline:auto;' : '';
        return '<section class="section section--tight" style="' + style + '"><div class="wrap">' +
          '<div style="max-width:62ch;' + wrapStyle + '">' +
          (s.eyebrow ? '<span class="eyebrow' + (s.bg === 'brand' ? '' : ' eyebrow--muted') + '">' + esc(s.eyebrow) + '</span>' : '') +
          (s.title ? '<h2 class="h-display h2" style="margin-top:8px;' + (s.bg === 'brand' ? 'color:var(--paper)' : '') + '">' + esc(s.title) + '</h2>' : '') +
          (s.body ? '<p style="margin-top:14px;font-size:16.5px;' + (s.bg === 'brand' ? 'color:rgba(251,250,246,.85)' : 'color:var(--muted)') + '">' + nl2br(s.body) + '</p>' : '') +
          '</div></div></section>';
      }
    },

    banner: {
      label: 'Bandeau image + texte',
      desc: 'Une image à côté d’un bloc de texte.',
      fields: [
        { k: 'image',  t: 'media', label: 'Image' },
        { k: 'eyebrow',t: 'text',  label: 'Surtitre' },
        { k: 'title',  t: 'text',  label: 'Titre' },
        { k: 'text',   t: 'textarea', label: 'Texte', rows: 4 },
        { k: 'cta',    t: 'text',  label: 'Bouton' },
        { k: 'ctaHref',t: 'link',  label: 'Lien du bouton' },
        { k: 'side',   t: 'select', label: 'Position de l’image', options: [['left', 'À gauche'], ['right', 'À droite']] }
      ],
      defaults: {
        image: 'products/cosmetics/beurre-de-karite.jpg', eyebrow: 'Burkina Faso',
        title: 'Le karité, pressé à froid', text: "Notre beurre vient d'un groupement féminin du Burkina Faso. Non raffiné, sans parfum ajouté.",
        cta: 'Découvrir', ctaHref: 'produit.html?id=karite', side: 'left'
      },
      render: function (s, ctx) {
        const img = '<div style="border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--line);aspect-ratio:4/3">' +
          '<img src="' + ctx.p(s.image) + '" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>';
        const txt = '<div>' +
          (s.eyebrow ? '<span class="eyebrow eyebrow--muted">' + esc(s.eyebrow) + '</span>' : '') +
          (s.title ? '<h2 class="h-display h2" style="margin:8px 0 12px">' + esc(s.title) + '</h2>' : '') +
          (s.text ? '<p class="lede">' + nl2br(s.text) + '</p>' : '') +
          (s.cta ? '<a class="btn btn--primary" style="margin-top:24px" href="' + esc(s.ctaHref) + '">' + esc(s.cta) + '</a>' : '') +
          '</div>';
        return '<section class="section section--tight"><div class="wrap">' +
          '<div class="banner-grid">' + (s.side === 'right' ? txt + img : img + txt) + '</div></div></section>';
      }
    },

    faq: {
      label: 'Questions fréquentes',
      desc: 'Liste de questions/réponses dépliables.',
      fields: [
        { k: 'title', t: 'text', label: 'Titre' },
        { k: 'items', t: 'repeat', label: 'Questions', item: [
            { k: 'q', t: 'text', label: 'Question' },
            { k: 'a', t: 'textarea', label: 'Réponse', rows: 3 }
          ], max: 10 }
      ],
      defaults: {
        title: 'Questions fréquentes',
        items: [
          { q: 'Livrez-vous partout en Europe ?', a: "Oui. Expédition Mondial Relay vers toute l'Europe, suivi inclus, à partir de 3 €." },
          { q: 'Comment sont préparées les commandes ?', a: 'Chaque commande est préparée et déposée à la main par la maison, avec un contrôle qualité avant expédition.' },
          { q: 'Les produits frais voyagent-ils bien ?', a: "Nos produits sont emballés avec soin et expédiés le plus rapidement possible. Signalez tout problème sous 24 h." }
        ]
      },
      render: function (s) {
        return '<section class="section section--tight"><div class="wrap" style="max-width:820px">' +
          (s.title ? '<h2 class="h-display h2" style="margin-bottom:28px">' + esc(s.title) + '</h2>' : '') +
          (s.items || []).map(function (i) {
            return '<details class="faq"><summary class="faq__q">' + esc(i.q) +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>' +
              '</summary><p class="faq__a">' + nl2br(i.a) + '</p></details>';
          }).join('') + '</div></section>';
      }
    },

    newsletter: {
      label: 'Inscription newsletter',
      desc: 'Bloc vert avec champ e-mail.',
      fields: [
        { k: 'title', t: 'text', label: 'Titre' },
        { k: 'text',  t: 'textarea', label: 'Texte', rows: 2 },
        { k: 'cta',   t: 'text', label: 'Bouton' }
      ],
      defaults: { title: 'Recevez nos nouveautés & offres privées', text: "Une fois par mois : les nouveautés, les éditions limitées, et rien d'autre.", cta: "S'inscrire" },
      render: function (s) {
        return '<section class="section section--tight"><div class="wrap"><div class="news">' +
          '<div><h2 class="news__title">' + esc(s.title) + '</h2>' +
          '<p class="news__text">' + nl2br(s.text) + '</p></div>' +
          '<form class="news__form" data-newsletter>' +
          '<label class="visually-hidden" for="news-email">Adresse e-mail</label>' +
          '<input class="news__input" id="news-email" type="email" placeholder="vous@exemple.com" required>' +
          '<button class="btn btn--light" type="submit">' + esc(s.cta) + '</button>' +
          '</form></div></div></section>';
      }
    },

    gallery: {
      label: 'Galerie d’images',
      desc: 'Bande d’images en grille.',
      fields: [
        { k: 'title',  t: 'text', label: 'Titre' },
        { k: 'images', t: 'repeat', label: 'Images', item: [
            { k: 'src',     t: 'media', label: 'Image' },
            { k: 'caption', t: 'text',  label: 'Légende' }
          ], max: 8 }
      ],
      defaults: {
        title: 'Nos producteurs',
        images: [
          { src: 'products/exotic/gari.jpeg', caption: 'Afrique de l’Ouest' },
          { src: 'products/exotic/hibiscus.jpg', caption: 'Burkina Faso' },
          { src: 'products/exotic/attieke.jpg', caption: "Côte d'Ivoire" },
          { src: 'products/cosmetics/beurre-de-karite.jpg', caption: 'Burkina Faso' }
        ]
      },
      render: function (s, ctx) {
        return '<section class="section section--tight"><div class="wrap">' +
          (s.title ? '<h2 class="h-display h2" style="margin-bottom:28px">' + esc(s.title) + '</h2>' : '') +
          '<div class="gal">' + (s.images || []).map(function (i) {
            return '<figure class="gal__i"><img src="' + ctx.p(i.src) + '" alt="' + esc(i.caption) + '" loading="lazy">' +
              (i.caption ? '<figcaption>' + esc(i.caption) + '</figcaption>' : '') + '</figure>';
          }).join('') + '</div></div></section>';
      }
    }
  };

  /* ---------------- Configuration par défaut ---------------- */
  function defaults(type) {
    return JSON.parse(JSON.stringify(TYPES[type].defaults || {}));
  }

  const DEFAULT_SECTIONS = [
    { id: 'sec_hero',  type: 'hero',       on: true, s: defaults('hero') },
    { id: 'sec_cats',  type: 'categories', on: true, s: defaults('categories') },
    { id: 'sec_pop',   type: 'products',   on: true, s: defaults('products') },
    { id: 'sec_new',   type: 'products',   on: true, s: Object.assign(defaults('products'), {
        eyebrow: 'Arrivages', title: 'Nouveautés de la semaine', source: 'new', limit: 5, linkHref: 'nouveautes.html' }) },
    { id: 'sec_ban',   type: 'banner',     on: true, s: defaults('banner') },
    { id: 'sec_feat',  type: 'features',   on: true, s: defaults('features') },
    { id: 'sec_news',  type: 'newsletter', on: true, s: defaults('newsletter') }
  ];

  const DEFAULT_MENU = [
    { label: 'Accueil',            href: 'index.html',       on: true, children: [] },
    { label: 'Cosmétiques',        href: 'cosmetiques.html', on: true, children: [] },
    { label: 'Produits exotiques', href: 'exotiques.html',   on: true, children: [] },
    { label: 'Nouveautés',         href: 'nouveautes.html',  on: true, children: [] },
    { label: 'Notre histoire',     href: 'histoire.html',    on: true, children: [] },
    { label: 'Contact',            href: 'contact.html',     on: true, children: [] }
  ];

  const DEFAULT_THEME = {
    brand: '#C9A84C', brandHover: '#9A7A2E',
    paper: '#FFFFFF', paper2: '#F6F3EC',
    ink: '#111110', muted: '#7A7467',
    radius: '2px', btnRadius: '2px',
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'Space Grotesk', -apple-system, 'Segoe UI', sans-serif",
    baseSize: '16px', scale: '1',
    announce: 'Livraison Mondial Relay offerte dès 100 € — partout en Europe',
    announceOn: true,
    footerAbout: "Cosmétiques naturels et produits exotiques sélectionnés avec soin, livrés partout en Europe depuis notre atelier.",
    showOrigine: true
  };

  const FONT_CHOICES = [
    ["'Playfair Display', Georgia, serif", 'Playfair Display (serif éditorial)'],
    ["Georgia, 'Times New Roman', serif", 'Georgia (serif classique)'],
    ["'Space Grotesk', -apple-system, sans-serif", 'Space Grotesk (sans-serif géométrique)'],
    ["'Inter', -apple-system, sans-serif", 'Inter (sans-serif neutre)'],
    ["ui-monospace, 'SF Mono', Menlo, monospace", 'Monospace']
  ];

  /* ---------------- Rendu ---------------- */
  // prefix : '' depuis la racine, '../' si la page est dans un sous-dossier.
  function renderSections(list, opts) {
    opts = opts || {};
    const prefix = opts.prefix || '';
    const ctx = {
      products: opts.products || window.ORIXA_PRODUCTS || [],
      categories: opts.categories || window.ORIXA_CATEGORIES || [],
      p: function (u) {
        if (!u) return '';
        return /^(https?:|data:|\/)/.test(u) ? u : prefix + u;
      },
      card: opts.card || window.OrixaCard || function () { return ''; },
      head: function (s) {
        if (!s.title && !s.eyebrow) return '';
        return '<div class="sec-head"><div>' +
          (s.eyebrow ? '<span class="eyebrow eyebrow--muted">' + esc(s.eyebrow) + '</span>' : '') +
          (s.title ? '<h2 class="h-display h2" style="margin-top:8px">' + esc(s.title) + '</h2>' : '') +
          '</div>' +
          (s.linkText ? '<a class="sec-head__link" href="' + esc(s.linkHref || '#') + '">' + esc(s.linkText) + ' &rarr;</a>' : '') +
          '</div>';
      }
    };

    return (list || []).filter(function (b) { return b.on !== false; }).map(function (b) {
      const t = TYPES[b.type];
      if (!t) return '';
      try {
        return '<div data-section-id="' + b.id + '">' + t.render(b.s || {}, ctx) + '</div>';
      } catch (e) {
        return '<!-- section ' + b.type + ' en erreur -->';
      }
    }).join('');
  }

  function renderMenu(menu, opts) {
    opts = opts || {};
    const prefix = opts.prefix || '';
    const active = opts.active || '';
    const p = function (u) { return /^(https?:|\/)/.test(u) ? u : prefix + u; };

    const desktop = (menu || []).filter(function (m) { return m.on !== false; }).map(function (m) {
      const cur = (m.href === active) ? ' aria-current="page"' : '';
      if (m.children && m.children.length) {
        return '<div class="nav__item"><a class="nav__link" href="' + p(m.href) + '" aria-expanded="false" aria-haspopup="true"' + cur + '>' +
          esc(m.label) + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></a>' +
          '<div class="nav__panel" role="menu">' + m.children.map(function (c) {
            return '<a class="nav__panel-link" role="menuitem" href="' + p(c.href) + '">' +
              '<span class="nav__panel-title">' + esc(c.label) + '</span>' +
              (c.desc ? '<span class="nav__panel-desc">' + esc(c.desc) + '</span>' : '') + '</a>';
          }).join('') + '</div></div>';
      }
      return '<a class="nav__link" href="' + p(m.href) + '"' + cur + '>' + esc(m.label) + '</a>';
    }).join('');

    const mobile = (menu || []).filter(function (m) { return m.on !== false; }).reduce(function (acc, m) {
      acc.push('<a href="' + p(m.href) + '">' + esc(m.label) + '</a>');
      (m.children || []).forEach(function (c) {
        acc.push('<a href="' + p(c.href) + '" style="padding-left:16px;color:var(--muted)">' + esc(c.label) + '</a>');
      });
      return acc;
    }, []).join('');

    return { desktop: desktop, mobile: mobile };
  }

  function applyTheme(t, doc) {
    doc = doc || document;
    const r = doc.documentElement;
    const s = Object.assign({}, DEFAULT_THEME, t || {});
    r.style.setProperty('--brand', s.brand);
    r.style.setProperty('--brand-hover', s.brandHover);
    r.style.setProperty('--paper', s.paper);
    r.style.setProperty('--paper-2', s.paper2);
    r.style.setProperty('--ink', s.ink);
    r.style.setProperty('--muted', s.muted);
    r.style.setProperty('--r-sm', s.radius);
    r.style.setProperty('--btn-r', s.btnRadius);
    r.style.setProperty('--f-display', s.fontDisplay);
    r.style.setProperty('--f-sans', s.fontBody);
    r.style.setProperty('--base-size', s.baseSize);
    r.style.setProperty('--type-scale', s.scale);
    r.style.setProperty('--origine-display', s.showOrigine ? 'inline-flex' : 'none');
    return s;
  }

  window.OrixaTheme = {
    TYPES: TYPES,
    FONT_CHOICES: FONT_CHOICES,
    DEFAULT_SECTIONS: DEFAULT_SECTIONS,
    DEFAULT_MENU: DEFAULT_MENU,
    DEFAULT_THEME: DEFAULT_THEME,
    defaults: defaults,
    uid: uid,
    esc: esc,
    renderSections: renderSections,
    renderMenu: renderMenu,
    applyTheme: applyTheme
  };
})();
