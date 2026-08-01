/* =========================================================
   ORIXA — site.js (front office)
   Rend les sections et le menu définis dans l'administration,
   applique le thème, gère panier / favoris / header.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Stockage sûr ---------- */
  const mem = {};
  const Store = {
    get(k, fb) {
      try { const v = localStorage.getItem(k); return v === null ? fb : JSON.parse(v); }
      catch (e) { return k in mem ? mem[k] : fb; }
    },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  window.OrixaStore = Store;

  const T = window.OrixaTheme;
  const PREFIX = document.body && document.body.getAttribute('data-prefix') || '';

  /* ---------- Bandeau cookies (RGPD) ---------- */
  function initCookies() {
    var done = false;
    try { done = !!localStorage.getItem('orixa:cookies'); } catch (e) {}
    if (done) return;
    var bar = document.createElement('aside');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Consentement aux cookies');
    bar.innerHTML =
      '<p class="cookie-bar__text">ORIXA utilise le stockage local de votre navigateur pour le panier et les favoris. Aucun traceur publicitaire n\'est déposé. <a href="' + PREFIX + 'legal.html#cookies">En savoir plus</a></p>' +
      '<div class="cookie-bar__actions">' +
      '<button type="button" class="cookie-bar__refuse" data-cookie-choice="refuser">Refuser</button>' +
      '<button type="button" class="btn btn--light btn--sm" data-cookie-choice="accepter">Accepter</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie-choice]');
      if (!b) return;
      try { localStorage.setItem('orixa:cookies', b.getAttribute('data-cookie-choice')); } catch (err) {}
      bar.remove();
    });
  }

  /* ---------- Toast ---------- */
  let tEl = null, tTimer = null;
  function toast(msg) {
    if (!tEl) {
      tEl = document.createElement('div');
      tEl.className = 'toast';
      tEl.setAttribute('role', 'status');
      tEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(tEl);
    }
    tEl.textContent = msg;
    tEl.setAttribute('data-open', 'true');
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { tEl.setAttribute('data-open', 'false'); }, 2600);
  }
  window.OrixaToast = toast;

  /* ---------- Catalogue effectif (admin peut l'avoir modifié) ---------- */
  function products() {
    const saved = Store.get('orixa:products', null);
    if (saved && Array.isArray(saved) && saved.length) return saved;
    return window.ORIXA_PRODUCTS || [];
  }
  window.OrixaProducts = products;

  /* ---------- Rayons effectifs (éditables depuis l'admin) ---------- */
  function categories() {
    const saved = Store.get('orixa:categories', null);
    if (saved && Array.isArray(saved) && saved.length) return saved;
    return window.ORIXA_CATEGORIES || [];
  }
  window.OrixaCategories = categories;

  /* ---------- Panier ---------- */
  const Cart = {
    items() { return Store.get('orixa:cart', []); },
    save(i) { Store.set('orixa:cart', i); this.render(); },
    count() { return this.items().reduce(function (n, i) { return n + i.qte; }, 0); },
    total() {
      const P = products();
      return this.items().reduce(function (t, i) {
        const p = P.find(function (x) { return x.id === i.id; });
        return p ? t + p.prix * i.qte : t;
      }, 0);
    },
    add(id, qte) {
      qte = qte || 1;
      const items = this.items();
      const f = items.find(function (i) { return i.id === id; });
      if (f) f.qte += qte; else items.push({ id: id, qte: qte });
      this.save(items);
      const p = products().find(function (x) { return x.id === id; });
      toast((p ? p.nom : 'Article') + ' ajouté au panier');
    },
    remove(id) { this.save(this.items().filter(function (i) { return i.id !== id; })); },
    clear() { this.save([]); },
    render() {
      const badge = document.querySelector('[data-cart-count]');
      const n = this.count();
      if (badge) { badge.textContent = n; badge.style.display = n > 0 ? 'inline-flex' : 'none'; }

      const body = document.querySelector('[data-cart-body]');
      if (!body) return;
      const P = products(), items = this.items();

      if (!items.length) {
        body.innerHTML = '<div class="empty" style="padding:48px 16px">' +
          '<p class="empty__title">Votre panier est vide</p>' +
          '<p class="empty__text">Parcourez la boutique pour le remplir.</p>' +
          '<a class="btn btn--primary" href="' + PREFIX + 'boutique.html">Voir la boutique</a></div>';
      } else {
        body.innerHTML = items.map(function (i) {
          const p = P.find(function (x) { return x.id === i.id; });
          if (!p) return '';
          return '<div class="line"><img class="line__img" src="' + PREFIX + p.img + '" alt="" loading="lazy">' +
            '<div><p class="line__name">' + p.nom + '</p>' +
            '<p class="line__meta">' + p.unite + ' · quantité ' + i.qte + '</p>' +
            '<button class="line__rm" data-cart-remove="' + p.id + '">Retirer</button></div>' +
            '<p class="line__price">' + window.OrixaFmt.prix(p.prix * i.qte) + '</p></div>';
        }).join('');
      }
      const tot = document.querySelector('[data-cart-total]');
      if (tot) tot.textContent = window.OrixaFmt.prix(this.total());
      const co = document.querySelector('[data-cart-checkout]');
      if (co) co.disabled = items.length === 0;
    }
  };
  window.OrixaCart = Cart;

  /* ---------- Favoris ---------- */
  const Fav = {
    ids() { return Store.get('orixa:favs', []); },
    has(id) { return this.ids().indexOf(id) !== -1; },
    toggle(id) {
      const ids = this.ids(), i = ids.indexOf(id);
      if (i === -1) { ids.push(id); toast('Ajouté aux favoris'); }
      else { ids.splice(i, 1); toast('Retiré des favoris'); }
      Store.set('orixa:favs', ids);
      return i === -1;
    }
  };
  window.OrixaFav = Fav;

  /* ---------- Carte produit ---------- */
  window.OrixaCard = function (p) {
    const badgeClass = p.badge === 'Nouveau' ? 'badge badge--new'
      : p.badge === 'Promo' ? 'badge badge--promo' : 'badge';
    const rupture = p.stock <= 0;
    return '<article class="prod-card"><div class="prod-card__media">' +
      '<a href="' + PREFIX + 'produit.html?id=' + p.id + '" aria-label="' + p.nom + '">' +
      '<img src="' + PREFIX + p.img + '" alt="' + p.nom + '" loading="lazy" width="400" height="400"></a>' +
      (p.badge ? '<span class="prod-card__badge ' + badgeClass + '">' + p.badge + '</span>' : '') +
      (rupture ? '<span class="prod-card__badge badge badge--rupture">Rupture</span>' : '') +
      '<button class="prod-card__fav" data-fav="' + p.id + '" aria-pressed="' + Fav.has(p.id) + '" aria-label="Ajouter ' + p.nom + ' aux favoris">' +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.8 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></button>' +
      '</div><div class="prod-card__body">' +
      '<span class="origine">' + p.origine + '</span>' +
      '<a href="' + PREFIX + 'produit.html?id=' + p.id + '"><h3 class="prod-card__name">' + p.nom + '</h3></a>' +
      '<p class="prod-card__meta">' + p.unite + '</p>' +
      '<div class="prod-card__foot"><span class="prod-card__price">' + window.OrixaFmt.prix(p.prix) + '</span>' +
      '<button class="btn btn--secondary btn--sm" data-add="' + p.id + '"' + (rupture ? ' disabled' : '') + '>' +
      (rupture ? 'Indisponible' : 'Ajouter') + '</button></div></div></article>';
  };

  /* ---------- Application du thème / menu / sections ---------- */
  function theme()   { return Object.assign({}, T.DEFAULT_THEME,    Store.get('orixa:theme', {})); }
  function menu()    { return Store.get('orixa:menu:v2',     T.DEFAULT_MENU); }
  function sections(){ return Store.get('orixa:sections:v2', T.DEFAULT_SECTIONS); }
  function settings(){ return Object.assign({}, window.OrixaAdmin ? window.OrixaAdmin.DEFAULT_SETTINGS : {}, Store.get('orixa:settings', {})); }

  function paint(over) {
    const th = over && over.theme ? Object.assign({}, theme(), over.theme) : theme();
    T.applyTheme(th, document);

    // Bandeau d'annonce
    const ann = document.querySelector('[data-announce]');
    if (ann) {
      const txt = th.announce || '';
      ann.textContent = txt;
      ann.parentElement.hidden = !th.announceOn || !txt;
    }
    // Texte "à propos" du pied de page
    document.querySelectorAll('[data-footer-about]').forEach(function (el) {
      el.textContent = th.footerAbout || '';
    });

    // Menu
    const m = (over && over.menu) || menu();
    const rendered = T.renderMenu(m, { prefix: PREFIX, active: document.body.getAttribute('data-active') || '' });
    const nav = document.querySelector('[data-nav]');
    const mnav = document.querySelector('[data-mobile-nav]');
    if (nav)  nav.innerHTML  = rendered.desktop;
    if (mnav) mnav.innerHTML = rendered.mobile +
      '<a href="' + PREFIX + 'compte/index.html">Connexion</a>';

    // Sections (uniquement sur les pages composées)
    const host = document.querySelector('[data-sections]');
    if (host) {
      const list = (over && over.sections) || sections();
      host.innerHTML = T.renderSections(list, {
        prefix: PREFIX, products: products(),
        categories: categories(), card: window.OrixaCard
      });
      bindNewsletter();
    }
    initDropdowns();
  }
  window.OrixaPaint = paint;

  function bindNewsletter() {
    document.querySelectorAll('[data-newsletter]').forEach(function (f) {
      if (f.__bound) return;
      f.__bound = true;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        toast('Inscription enregistrée. À mercredi !');
        f.reset();
      });
    });
  }

  /* ---------- Header ---------- */
  function initDropdowns() {
    document.querySelectorAll('.nav__item').forEach(function (item) {
      if (item.__bound) return;
      item.__bound = true;
      const trigger = item.querySelector('.nav__link');
      if (!trigger) return;
      function open(v) {
        item.setAttribute('data-open', v ? 'true' : 'false');
        trigger.setAttribute('aria-expanded', v ? 'true' : 'false');
      }
      item.addEventListener('mouseenter', function () { open(true); });
      item.addEventListener('mouseleave', function () { open(false); });
      trigger.addEventListener('click', function (e) {
        if (item.querySelector('.nav__panel')) { e.preventDefault(); open(item.getAttribute('data-open') !== 'true'); }
      });
      item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) open(false); });
    });
  }

  function initHeader() {
    const burger = document.querySelector('[data-burger]');
    const mnav = document.querySelector('.mobile-nav');
    if (burger && mnav) {
      burger.addEventListener('click', function () {
        const o = mnav.getAttribute('data-open') !== 'true';
        mnav.setAttribute('data-open', o ? 'true' : 'false');
        burger.setAttribute('aria-expanded', o ? 'true' : 'false');
      });
    }

    const drawer = document.querySelector('[data-drawer]');
    const scrim = document.querySelector('[data-scrim]');
    function setDrawer(o) {
      if (!drawer || !scrim) return;
      drawer.setAttribute('data-open', o ? 'true' : 'false');
      scrim.setAttribute('data-open', o ? 'true' : 'false');
      document.body.style.overflow = o ? 'hidden' : '';
      if (o) { const c = drawer.querySelector('[data-drawer-close]'); if (c) c.focus(); }
    }
    document.querySelectorAll('[data-drawer-open]').forEach(function (b) {
      b.addEventListener('click', function () { Cart.render(); setDrawer(true); });
    });
    document.querySelectorAll('[data-drawer-close]').forEach(function (b) {
      b.addEventListener('click', function () { setDrawer(false); });
    });
    if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (drawer && drawer.getAttribute('data-open') === 'true') setDrawer(false);
      document.querySelectorAll('.nav__item[data-open="true"]').forEach(function (i) {
        i.setAttribute('data-open', 'false');
      });
    });
  }

  /* ---------- Sélecteur de devise (préférence du visiteur) ---------- */
  function initCurrencyPicker() {
    const list = window.OrixaCurrency ? window.OrixaCurrency.list() : [];
    if (!list.length) return;
    const eff = window.OrixaCurrency.get();

    function makeSelect(cls) {
      const sel = document.createElement('select');
      sel.className = cls;
      sel.setAttribute('aria-label', 'Choisir la devise');
      list.forEach(function (c) {
        const o = document.createElement('option');
        o.value = c.code;
        o.textContent = c.code + ' ' + c.symbol;
        if (c.code === eff.code) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () {
        window.OrixaCurrency.set(sel.value);
        location.reload();
      });
      return sel;
    }

    // Pas sur la page de commande : le rechargement effacerait la saisie en cours
    if (document.querySelector('[data-checkout]')) return;

    // Header (bureau)
    const actions = document.querySelector('.header__actions');
    if (actions) {
      const wrap = document.createElement('label');
      wrap.className = 'currency-pick';
      wrap.title = 'Changer la devise';
      wrap.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
      wrap.appendChild(makeSelect('currency-pick__select'));
      const burger = document.querySelector('[data-burger]');
      actions.insertBefore(wrap, burger || actions.firstChild);
    }

    // Menu mobile
    const mnav = document.querySelector('[data-mobile-nav]');
    if (mnav) {
      const row = document.createElement('div');
      row.className = 'mobile-nav__currency';
      const lbl = document.createElement('span');
      lbl.textContent = 'Devise';
      row.appendChild(lbl);
      row.appendChild(makeSelect('mobile-nav__currency-select'));
      mnav.appendChild(row);
    }
  }

  /* ---------- Délégation ---------- */
  function initDelegation() {
    document.addEventListener('click', function (e) {
      const add = e.target.closest('[data-add]');
      if (add && !add.disabled) { Cart.add(add.getAttribute('data-add'), 1); return; }
      const rm = e.target.closest('[data-cart-remove]');
      if (rm) { Cart.remove(rm.getAttribute('data-cart-remove')); return; }
      const fav = e.target.closest('[data-fav]');
      if (fav) {
        const on = Fav.toggle(fav.getAttribute('data-fav'));
        fav.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    });
  }

  /* ---------- Libellé de rayon (via OrixaFmt, mis à jour si besoin) ---------- */
  if (window.OrixaFmt) {
    window.OrixaFmt.cat = function (id) {
      const c = categories().find(function (x) { return x.id === id; });
      return c ? c.label : id;
    };
  }

  /* ---------- Aperçu live depuis l'administration ---------- */
  window.addEventListener('message', function (e) {
    const d = e.data;
    if (!d || d.type !== 'orixa:preview') return;
    paint({ theme: d.theme, sections: d.sections, menu: d.menu });
    if (d.scrollTo) {
      const el = document.querySelector('[data-section-id="' + d.scrollTo + '"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    paint();
    initHeader();
    initCurrencyPicker();
    initDelegation();
    initCookies();
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
    Cart.render();
    // Appliquer les réglages site
    applySettings();

    // Signale à l'éditeur que la page est prête à recevoir l'aperçu
    try { if (window.parent !== window) window.parent.postMessage({ type: 'orixa:ready' }, '*'); } catch (e) {}
  });

  function applySettings() {
    const s = settings();
    // Meta title
    if (s.siteName) {
      document.querySelectorAll('title').forEach(function (el) {
        if (el.textContent.indexOf(s.siteName) === -1) {
          el.textContent = el.textContent.replace('ORIXA', s.siteName);
        }
      });
    }
    // Maintenance mode
    if (s.maintenanceMode) {
      var mainDiv = document.createElement('div');
      mainDiv.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:var(--brand);color:var(--paper);font-size:24px;text-align:center;padding:32px';
      mainDiv.textContent = s.maintenanceMessage || 'Site en maintenance';
      document.body.appendChild(mainDiv);
    }
  }
})();
