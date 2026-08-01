/* =========================================================
   ORIXA — editor.js
   Éditeur de thème type « constructeur de pages » :
   ajouter / réordonner / masquer / supprimer des sections,
   régler chacune via un formulaire généré depuis son schéma.
   ========================================================= */
(function () {
  'use strict';

  const A = window.OrixaAdmin;
  const T = window.OrixaTheme;
  const esc = T.esc;

  let draft = {
    theme: A.theme(),
    sections: A.sections(),
    menu: A.menu()
  };
  let dirty = false;
  let openSection = null;   // id de la section en cours d'édition
  let frameReady = false;

  const frame = document.querySelector('[data-frame]');
  const panel = document.querySelector('[data-panel]');
  const stateEl = document.querySelector('[data-state]');

  /* ---------------- Aperçu ---------------- */
  function push(scrollTo) {
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage({
        type: 'orixa:preview',
        theme: draft.theme,
        sections: draft.sections,
        menu: draft.menu,
        scrollTo: scrollTo || null
      }, '*');
    } catch (e) { /* aperçu indisponible hors serveur HTTP */ }
  }

  function mark(d) {
    dirty = d;
    if (!stateEl) return;
    stateEl.textContent = d ? 'Modifications non enregistrées' : 'À jour';
    stateEl.style.color = d ? 'var(--a-warn)' : 'var(--a-muted)';
  }

  function touch(scrollTo) { push(scrollTo); mark(true); }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'orixa:ready') { frameReady = true; push(); }
  });
  if (frame) frame.addEventListener('load', function () { setTimeout(push, 200); });

  /* ---------------- Icônes ---------------- */
  const ico = {
    eye:   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 3.87-4.87"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a17.63 17.63 0 0 1-3.17 4.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="2" y1="2" x2="22" y2="22"/></svg>',
    up:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
    down:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
    back:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
    plus:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    grip:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>'
  };

  /* ---------------- Rendu du panneau ---------------- */
  function render() {
    if (openSection) renderSectionForm();
    else renderList();
  }

  function tabs(active) {
    return '<div class="etabs">' +
      '<button class="etab" data-tab="sections" aria-pressed="' + (active === 'sections') + '">Sections</button>' +
      '<button class="etab" data-tab="theme" aria-pressed="' + (active === 'theme') + '">Thème</button>' +
      '</div>';
  }

  let tab = 'sections';

  function renderList() {
    if (tab === 'theme') return renderTheme();

    const items = draft.sections.map(function (b, i) {
      const t = T.TYPES[b.type];
      const label = (b.s && (b.s.title || b.s.eyebrow)) || (t ? t.label : b.type);
      return '<li class="srow' + (b.on === false ? ' srow--off' : '') + '">' +
        '<span class="srow__grip" aria-hidden="true">' + ico.grip + '</span>' +
        '<button class="srow__main" data-open="' + b.id + '">' +
          '<span class="srow__label">' + esc(String(label).slice(0, 42)) + '</span>' +
          '<span class="srow__type">' + esc(t ? t.label : b.type) + '</span>' +
        '</button>' +
        '<span class="srow__acts">' +
          '<button class="ibtn" data-up="' + b.id + '" aria-label="Monter"' + (i === 0 ? ' disabled' : '') + '>' + ico.up + '</button>' +
          '<button class="ibtn" data-down="' + b.id + '" aria-label="Descendre"' + (i === draft.sections.length - 1 ? ' disabled' : '') + '>' + ico.down + '</button>' +
          '<button class="ibtn" data-toggle="' + b.id + '" aria-label="' + (b.on === false ? 'Afficher' : 'Masquer') + '" aria-pressed="' + (b.on !== false) + '">' +
            (b.on === false ? ico.eyeOff : ico.eye) + '</button>' +
        '</span></li>';
    }).join('');

    panel.innerHTML = tabs('sections') +
      '<div class="epanel">' +
        '<p class="ehint">Page d’accueil — ' + draft.sections.length + ' sections. Cliquez pour régler, utilisez les flèches pour réordonner.</p>' +
        '<ul class="slist">' + items + '</ul>' +
        '<button class="b b--default b--block" data-add-section style="margin-top:12px">' + ico.plus + ' Ajouter une section</button>' +
      '</div>';
  }

  function renderTheme() {
    const th = draft.theme;
    const fonts = T.FONT_CHOICES.map(function (f) {
      return '<option value="' + esc(f[0]) + '"' + (th.fontDisplay === f[0] ? ' selected' : '') + '>' + esc(f[1]) + '</option>';
    }).join('');
    const fonts2 = T.FONT_CHOICES.map(function (f) {
      return '<option value="' + esc(f[0]) + '"' + (th.fontBody === f[0] ? ' selected' : '') + '>' + esc(f[1]) + '</option>';
    }).join('');

    function color(k, label, hint) {
      return '<div class="f"><label class="f__label" for="t-' + k + '">' + label + '</label>' +
        '<div class="color-row"><input type="color" id="t-' + k + '" data-tcolor="' + k + '" value="' + (/^#[0-9a-f]{6}$/i.test(th[k]) ? th[k] : '#000000') + '" aria-label="' + label + '">' +
        '<input class="f__ctrl" type="text" data-theme="' + k + '" value="' + esc(th[k]) + '" spellcheck="false"></div>' +
        (hint ? '<p class="f__hint">' + hint + '</p>' : '') + '</div>';
    }

    panel.innerHTML = tabs('theme') + '<div class="epanel">' +
      '<h3 class="egroup">Couleurs</h3>' +
      color('brand', 'Couleur principale', 'Boutons, liens, bandeau.') +
      color('brandHover', 'Principale — survol') +
      color('paper', 'Fond de page') +
      color('paper2', 'Fond secondaire', 'Pied de page, cartes alternées.') +
      color('ink', 'Texte principal') +
      color('muted', 'Texte secondaire') +

      '<h3 class="egroup">Typographie</h3>' +
      '<div class="f"><label class="f__label" for="t-fd">Police des titres</label>' +
        '<select class="f__ctrl" id="t-fd" data-theme="fontDisplay">' + fonts + '</select></div>' +
      '<div class="f"><label class="f__label" for="t-fb">Police du texte</label>' +
        '<select class="f__ctrl" id="t-fb" data-theme="fontBody">' + fonts2 + '</select></div>' +
      '<div class="f"><label class="f__label" for="t-bs">Taille de base</label>' +
        '<select class="f__ctrl" id="t-bs" data-theme="baseSize">' +
        ['15px', '16px', '17px', '18px'].map(function (v) {
          return '<option value="' + v + '"' + (th.baseSize === v ? ' selected' : '') + '>' + v + '</option>';
        }).join('') + '</select></div>' +
      '<div class="f"><label class="f__label" for="t-sc">Échelle des titres <span class="f__val" data-val="scale">' + th.scale + '×</span></label>' +
        '<input class="f__range" id="t-sc" type="range" min="0.8" max="1.3" step="0.05" value="' + th.scale + '" data-theme="scale" data-suffix="×"></div>' +

      '<h3 class="egroup">Formes</h3>' +
      '<div class="f"><label class="f__label" for="t-r">Arrondi des cartes et champs</label>' +
        '<select class="f__ctrl" id="t-r" data-theme="radius">' +
        [['0px', 'Aucun — angles vifs'], ['4px', 'Léger'], ['6px', 'Standard'], ['10px', 'Marqué'], ['16px', 'Très arrondi']].map(function (v) {
          return '<option value="' + v[0] + '"' + (th.radius === v[0] ? ' selected' : '') + '>' + v[1] + '</option>';
        }).join('') + '</select></div>' +
      '<div class="f"><label class="f__label" for="t-br">Arrondi des boutons</label>' +
        '<select class="f__ctrl" id="t-br" data-theme="btnRadius">' +
        [['0px', 'Aucun'], ['6px', 'Standard'], ['10px', 'Marqué'], ['999px', 'Pilule']].map(function (v) {
          return '<option value="' + v[0] + '"' + (th.btnRadius === v[0] ? ' selected' : '') + '>' + v[1] + '</option>';
        }).join('') + '</select></div>' +

      '<h3 class="egroup">Bandeau d’annonce</h3>' +
      '<label class="switch" style="margin-bottom:12px"><input type="checkbox" data-theme="announceOn"' + (th.announceOn ? ' checked' : '') + '><span class="switch__track"></span><span>Afficher le bandeau</span></label>' +
      '<div class="f"><label class="f__label" for="t-an">Texte</label>' +
        '<textarea class="f__ctrl" id="t-an" rows="3" data-theme="announce">' + esc(th.announce) + '</textarea></div>' +

      '<h3 class="egroup">Pied de page</h3>' +
      '<div class="f"><label class="f__label" for="t-fa">Texte de présentation</label>' +
        '<textarea class="f__ctrl" id="t-fa" rows="3" data-theme="footerAbout">' + esc(th.footerAbout) + '</textarea></div>' +

      '<h3 class="egroup">Affichage produits</h3>' +
      '<label class="switch"><input type="checkbox" data-theme="showOrigine"' + (th.showOrigine ? ' checked' : '') + '><span class="switch__track"></span><span>Afficher la provenance sur les cartes</span></label>' +
      '</div>';
  }

  /* ---------------- Formulaire d'une section ---------------- */
  function field(f, val, path) {
    const id = 'f_' + path.replace(/[^a-z0-9]/gi, '_');
    const L = '<label class="f__label" for="' + id + '">' + esc(f.label) + '</label>';
    let ctrl = '';

    switch (f.t) {
      case 'textarea':
        ctrl = '<textarea class="f__ctrl" id="' + id + '" rows="' + (f.rows || 3) + '" data-path="' + path + '">' + esc(val) + '</textarea>';
        break;
      case 'select':
        ctrl = '<select class="f__ctrl" id="' + id + '" data-path="' + path + '">' +
          f.options.map(function (o) {
            return '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
          }).join('') + '</select>';
        break;
      case 'toggle':
        return '<label class="switch" style="margin-bottom:16px"><input type="checkbox" data-path="' + path + '"' + (val ? ' checked' : '') + '><span class="switch__track"></span><span>' + esc(f.label) + '</span></label>';
      case 'range':
        ctrl = '<input class="f__range" id="' + id + '" type="range" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + (val || f.min) + '" data-path="' + path + '" data-suffix="' + (f.suffix || '') + '">';
        return '<div class="f"><label class="f__label" for="' + id + '">' + esc(f.label) +
          ' <span class="f__val" data-val="' + path + '">' + (val || f.min) + (f.suffix || '') + '</span></label>' + ctrl + '</div>';
      case 'media':
        ctrl = '<div class="mpick">' +
          '<img class="mpick__img" src="../' + esc(val || 'assets/img/placeholder.svg') + '" alt="">' +
          '<div class="mpick__meta"><span>' + esc(String(val || '').split('/').pop() || 'Aucune image') + '</span>' +
          '<button class="b b--default b--sm" type="button" data-pick-media="' + path + '">Choisir une image</button></div></div>';
        break;
      case 'video':
        ctrl = '<input class="f__ctrl" id="' + id + '" value="' + esc(val) + '" data-path="' + path + '">' +
          '<p class="f__hint">Chemin du fichier vidéo, par ex. assets/video/hero.mp4</p>';
        break;
      case 'link':
        ctrl = '<input class="f__ctrl" id="' + id + '" value="' + esc(val) + '" data-path="' + path + '" list="orixa-links">';
        break;
      case 'category':
        ctrl = '<select class="f__ctrl" id="' + id + '" data-path="' + path + '">' +
          (window.ORIXA_CATEGORIES || []).map(function (c) {
            return '<option value="' + c.id + '"' + (val === c.id ? ' selected' : '') + '>' + esc(c.label) + '</option>';
          }).join('') + '</select>';
        break;
      case 'products': {
        const P = A.products();
        const chosen = (val || []).map(function (id) { return P.find(function (p) { return p.id === id; }); }).filter(Boolean);
        ctrl = '<div class="ppick">' +
          (chosen.length ? chosen.map(function (p) {
            return '<span class="ptag"><img src="../' + p.img + '" alt="">' + esc(p.nom) +
              '<button type="button" data-unpick="' + path + '|' + p.id + '" aria-label="Retirer ' + esc(p.nom) + '">&times;</button></span>';
          }).join('') : '<span class="f__hint">Aucun produit sélectionné.</span>') +
          '</div><button class="b b--default b--sm" type="button" data-pick-products="' + path + '" style="margin-top:8px">Choisir des produits</button>';
        break;
      }
      case 'repeat': {
        const arr = val || [];
        ctrl = '<div class="rep">' + arr.map(function (item, i) {
          return '<div class="rep__i"><div class="rep__h"><span>' + esc(f.label) + ' ' + (i + 1) + '</span>' +
            '<span class="srow__acts">' +
            '<button class="ibtn" type="button" data-rup="' + path + '|' + i + '" aria-label="Monter"' + (i === 0 ? ' disabled' : '') + '>' + ico.up + '</button>' +
            '<button class="ibtn" type="button" data-rdown="' + path + '|' + i + '" aria-label="Descendre"' + (i === arr.length - 1 ? ' disabled' : '') + '>' + ico.down + '</button>' +
            '<button class="ibtn ibtn--danger" type="button" data-rdel="' + path + '|' + i + '" aria-label="Supprimer">' + ico.trash + '</button>' +
            '</span></div>' +
            f.item.map(function (sub) {
              return field(sub, item[sub.k], path + '.' + i + '.' + sub.k);
            }).join('') + '</div>';
        }).join('') +
        ((arr.length < (f.max || 8)) ? '<button class="b b--default b--sm b--block" type="button" data-radd="' + path + '">' + ico.plus + ' Ajouter</button>' : '') +
        '</div>';
        return '<div class="f"><span class="f__label">' + esc(f.label) + '</span>' + ctrl + '</div>';
      }
      default:
        ctrl = '<input class="f__ctrl" id="' + id + '" value="' + esc(val) + '" data-path="' + path + '">';
    }
    return '<div class="f">' + L + ctrl + (f.hint ? '<p class="f__hint">' + esc(f.hint) + '</p>' : '') + '</div>';
  }

  function visible(f, s) {
    if (!f.when) return true;
    return Object.keys(f.when).every(function (k) { return s[k] === f.when[k]; });
  }

  function renderSectionForm() {
    const b = draft.sections.find(function (x) { return x.id === openSection; });
    if (!b) { openSection = null; return renderList(); }
    const t = T.TYPES[b.type];

    panel.innerHTML =
      '<div class="ehead">' +
        '<button class="b b--ghost b--sm" data-back>' + ico.back + ' Sections</button>' +
        '<button class="b b--danger b--sm" data-del="' + b.id + '">' + ico.trash + ' Supprimer</button>' +
      '</div>' +
      '<div class="epanel">' +
        '<p class="ehint" style="margin-bottom:16px"><strong>' + esc(t.label) + '</strong><br>' + esc(t.desc) + '</p>' +
        '<label class="switch" style="margin-bottom:18px"><input type="checkbox" data-onoff="' + b.id + '"' + (b.on !== false ? ' checked' : '') + '><span class="switch__track"></span><span>Section visible</span></label>' +
        t.fields.filter(function (f) { return visible(f, b.s); })
                .map(function (f) { return field(f, b.s[f.k], 's.' + f.k); }).join('') +
      '</div>';
  }

  /* ---------------- Lecture/écriture par chemin ---------------- */
  function setPath(path, value) {
    const b = draft.sections.find(function (x) { return x.id === openSection; });
    if (!b) return;
    const parts = path.split('.');
    let cur = b;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i];
      cur = cur[/^\d+$/.test(k) ? Number(k) : k];
      if (cur == null) return;
    }
    const last = parts[parts.length - 1];
    cur[/^\d+$/.test(last) ? Number(last) : last] = value;
  }
  function getPath(path) {
    const b = draft.sections.find(function (x) { return x.id === openSection; });
    if (!b) return undefined;
    return path.split('.').reduce(function (o, k) {
      return o == null ? o : o[/^\d+$/.test(k) ? Number(k) : k];
    }, b);
  }

  /* ---------------- Modale générique ---------------- */
  const modal = document.querySelector('[data-emodal]');
  function openModal(title, html, onClick) {
    modal.querySelector('[data-emodal-title]').textContent = title;
    modal.querySelector('[data-emodal-body]').innerHTML = html;
    modal.__onClick = onClick;
    modal.showModal();
  }
  if (modal) {
    modal.querySelector('[data-emodal-body]').addEventListener('click', function (e) {
      if (modal.__onClick) modal.__onClick(e);
    });
    modal.querySelectorAll('[data-emodal-close]').forEach(function (b) {
      b.addEventListener('click', function () { modal.close(); });
    });
  }

  /* ---------------- Actions ---------------- */
  panel.addEventListener('click', function (e) {
    const t = e.target;

    const tb = t.closest('[data-tab]');
    if (tb) { tab = tb.getAttribute('data-tab'); openSection = null; return render(); }

    const op = t.closest('[data-open]');
    if (op) { openSection = op.getAttribute('data-open'); render(); return push(openSection); }

    if (t.closest('[data-back]')) { openSection = null; return render(); }

    const up = t.closest('[data-up]'), dn = t.closest('[data-down]');
    if (up || dn) {
      const id = (up || dn).getAttribute(up ? 'data-up' : 'data-down');
      const i = draft.sections.findIndex(function (x) { return x.id === id; });
      const j = up ? i - 1 : i + 1;
      if (j < 0 || j >= draft.sections.length) return;
      const tmp = draft.sections[i]; draft.sections[i] = draft.sections[j]; draft.sections[j] = tmp;
      render(); return touch(id);
    }

    const tg = t.closest('[data-toggle]');
    if (tg) {
      const b = draft.sections.find(function (x) { return x.id === tg.getAttribute('data-toggle'); });
      b.on = b.on === false;
      render(); return touch();
    }

    const del = t.closest('[data-del]');
    if (del) {
      if (!confirm('Supprimer cette section ?')) return;
      draft.sections = draft.sections.filter(function (x) { return x.id !== del.getAttribute('data-del'); });
      openSection = null; render(); return touch();
    }

    if (t.closest('[data-add-section]')) {
      const html = '<div class="tpick">' + Object.keys(T.TYPES).map(function (k) {
        return '<button class="tpick__i" type="button" data-newtype="' + k + '">' +
          '<span class="tpick__t">' + esc(T.TYPES[k].label) + '</span>' +
          '<span class="tpick__d">' + esc(T.TYPES[k].desc) + '</span></button>';
      }).join('') + '</div>';
      return openModal('Ajouter une section', html, function (ev) {
        const b = ev.target.closest('[data-newtype]');
        if (!b) return;
        const type = b.getAttribute('data-newtype');
        const id = T.uid('sec');
        draft.sections.push({ id: id, type: type, on: true, s: T.defaults(type) });
        modal.close(); openSection = id; render(); touch(id);
      });
    }

    // Répétables
    const radd = t.closest('[data-radd]');
    if (radd) {
      const path = radd.getAttribute('data-radd');
      const b = draft.sections.find(function (x) { return x.id === openSection; });
      const f = T.TYPES[b.type].fields.find(function (x) { return 's.' + x.k === path; });
      const blank = {};
      f.item.forEach(function (sub) { blank[sub.k] = sub.t === 'media' ? 'assets/img/placeholder.svg' : ''; });
      (getPath(path) || setPath(path, []) || getPath(path)).push(blank);
      render(); return touch();
    }
    const rdel = t.closest('[data-rdel]');
    if (rdel) {
      const [path, i] = rdel.getAttribute('data-rdel').split('|');
      getPath(path).splice(Number(i), 1);
      render(); return touch();
    }
    const rup = t.closest('[data-rup]'), rdn = t.closest('[data-rdown]');
    if (rup || rdn) {
      const [path, i] = (rup || rdn).getAttribute(rup ? 'data-rup' : 'data-rdown').split('|');
      const arr = getPath(path); const a = Number(i), bIdx = rup ? a - 1 : a + 1;
      if (bIdx < 0 || bIdx >= arr.length) return;
      const tmp = arr[a]; arr[a] = arr[bIdx]; arr[bIdx] = tmp;
      render(); return touch();
    }

    // Médiathèque
    const pm = t.closest('[data-pick-media]');
    if (pm) {
      const path = pm.getAttribute('data-pick-media');
      const html = '<div class="mgrid">' + A.media().map(function (m) {
        return '<button class="mgrid__i" type="button" data-msel="' + esc(m.src) + '">' +
          '<img src="../' + esc(m.src) + '" alt="" loading="lazy">' +
          '<span>' + esc(m.name) + '</span></button>';
      }).join('') + '</div>';
      return openModal('Choisir une image', html, function (ev) {
        const b = ev.target.closest('[data-msel]');
        if (!b) return;
        setPath(path, b.getAttribute('data-msel'));
        modal.close(); render(); touch(openSection);
      });
    }

    // Sélecteur de produits
    const pp = t.closest('[data-pick-products]');
    if (pp) {
      const path = pp.getAttribute('data-pick-products');
      const cur = getPath(path) || [];
      const html = '<div class="plist">' + A.products().map(function (p) {
        return '<label class="plist__i"><input type="checkbox" value="' + p.id + '"' + (cur.indexOf(p.id) !== -1 ? ' checked' : '') + '>' +
          '<img src="../' + p.img + '" alt=""><span><strong>' + esc(p.nom) + '</strong><br>' +
          '<span class="f__hint">' + window.OrixaFmt.prix(p.prix) + ' · ' + esc(p.unite) + '</span></span></label>';
      }).join('') + '</div>';
      return openModal('Choisir des produits', html, function (ev) {
        if (ev.target.tagName !== 'INPUT') return;
        const ids = Array.prototype.slice.call(modal.querySelectorAll('.plist input:checked')).map(function (i) { return i.value; });
        setPath(path, ids);
        touch(openSection);
      });
    }
    const un = t.closest('[data-unpick]');
    if (un) {
      const [path, id] = un.getAttribute('data-unpick').split('|');
      setPath(path, (getPath(path) || []).filter(function (x) { return x !== id; }));
      render(); return touch(openSection);
    }
  });

  /* ---------------- Saisie ---------------- */
  panel.addEventListener('input', function (e) {
    const el = e.target;

    const tk = el.getAttribute('data-theme');
    if (tk) {
      draft.theme[tk] = el.type === 'checkbox' ? el.checked : el.value;
      const c = panel.querySelector('[data-tcolor="' + tk + '"]');
      if (c && /^#[0-9a-f]{6}$/i.test(el.value)) c.value = el.value;
      const v = panel.querySelector('[data-val="' + tk + '"]');
      if (v) v.textContent = el.value + (el.getAttribute('data-suffix') || '');
      return touch();
    }
    const tc = el.getAttribute('data-tcolor');
    if (tc) {
      draft.theme[tc] = el.value;
      const txt = panel.querySelector('[data-theme="' + tc + '"]');
      if (txt) txt.value = el.value;
      return touch();
    }

    const path = el.getAttribute('data-path');
    if (path) {
      let v = el.type === 'checkbox' ? el.checked : el.value;
      if (el.type === 'range') {
        v = Number(v);
        const lab = panel.querySelector('[data-val="' + path + '"]');
        if (lab) lab.textContent = v + (el.getAttribute('data-suffix') || '');
      }
      setPath(path, v);
      return touch(openSection);
    }
  });

  panel.addEventListener('change', function (e) {
    const oo = e.target.getAttribute('data-onoff');
    if (oo) {
      const b = draft.sections.find(function (x) { return x.id === oo; });
      b.on = e.target.checked;
      return touch();
    }
    // Un select conditionnel (ex. média vidéo/image) doit redessiner le formulaire
    if (e.target.tagName === 'SELECT' && e.target.getAttribute('data-path') && openSection) {
      const b = draft.sections.find(function (x) { return x.id === openSection; });
      const has = T.TYPES[b.type].fields.some(function (f) { return f.when; });
      if (has) render();
    }
  });

  /* ---------------- Barre d'outils ---------------- */
  document.querySelectorAll('[data-vp]').forEach(function (b) {
    if (b.tagName !== 'BUTTON') return;
    b.addEventListener('click', function () {
      document.querySelectorAll('.vp-group button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      frame.setAttribute('data-vp', b.getAttribute('data-vp'));
    });
  });

  const pageSel = document.querySelector('[data-page]');
  if (pageSel) pageSel.addEventListener('change', function (e) {
    frame.src = e.target.value;
    const isHome = e.target.value.indexOf('index.html') !== -1;
    document.querySelector('[data-home-only]').hidden = isHome;
  });

  document.querySelector('[data-save]').addEventListener('click', function () {
    A.saveTheme(draft.theme);
    A.saveSections(draft.sections);
    A.saveMenu(draft.menu);
    mark(false);
    A.toast('Modifications publiées sur la boutique');
  });

  document.querySelector('[data-revert]').addEventListener('click', function () {
    if (!confirm('Rétablir le thème et les sections d’origine ? Les réglages publiés seront perdus.')) return;
    draft = {
      theme: Object.assign({}, T.DEFAULT_THEME),
      sections: JSON.parse(JSON.stringify(T.DEFAULT_SECTIONS)),
      menu: JSON.parse(JSON.stringify(T.DEFAULT_MENU))
    };
    A.saveTheme(draft.theme); A.saveSections(draft.sections); A.saveMenu(draft.menu);
    openSection = null; render(); push(); mark(false);
    A.toast('Thème rétabli');
  });

  window.addEventListener('beforeunload', function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  render();
  mark(false);
})();
