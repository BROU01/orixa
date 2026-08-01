/* =========================================================
   ORIXA — supabase.js
   Couche backend (Supabase) : session, hydratation du CMS,
   écriture en temps réel (write-through) et garde de sécurité
   du panneau d'administration.

   - Mode démo  : Supabase non configuré → le site fonctionne
                  en local (localStorage), comme avant.
   - Mode cloud : les données CMS (produits, thème, menu…)
                  sont partagées entre tous les visiteurs via
                  la table « cms » (lecture publique, écriture
                  réservée à l'administrateur grâce à la RLS).
   ========================================================= */
(function () {
  'use strict';

  var CFG = window.ORIXA_CONFIG || {};

  function isConfigured() {
    return !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY &&
      /^https:\/\//.test(String(CFG.SUPABASE_URL).trim()));
  }

  /* Clés CMS partagées (une ligne par clé dans la table cms).
     Le panier et les favoris restent locaux à chaque visiteur. */
  var CMS_KEYS = [
    'orixa:theme', 'orixa:sections:v2', 'orixa:menu:v2',
    'orixa:products', 'orixa:media', 'orixa:collections',
    'orixa:discounts', 'orixa:articles', 'orixa:pages',
    'orixa:users', 'orixa:categories', 'orixa:settings'
  ];

  var client = null, session = null, hydrating = false, hydrated = false;
  var SDK_PROMISE = null;
  var started = false;

  /* ---------- Chargement du SDK (CDN) ---------- */
  function loadSDK() {
    if (window.supabase) return Promise.resolve(window.supabase);
    if (SDK_PROMISE) return SDK_PROMISE;
    SDK_PROMISE = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.async = true;
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { reject(new Error('SDK Supabase introuvable (CDN bloqué ?).')); };
      document.head.appendChild(s);
    });
    return SDK_PROMISE;
  }

  function makeClient() {
    return loadSDK().then(function (sb) {
      if (!client) {
        client = sb.createClient(CFG.SUPABASE_URL.trim(), CFG.SUPABASE_ANON_KEY.trim(), {
          auth: { persistSession: true, autoRefreshToken: true, flowType: 'pkce' }
        });
      }
      return client;
    });
  }

  /* ---------- Session ---------- */
  function user() { return session && session.user ? session.user : null; }

  function refreshSession() {
    if (!isConfigured()) return Promise.resolve(null);
    return makeClient().then(function (c) {
      return c.auth.getSession().then(function (r) {
        session = (r && r.data && r.data.session) || null;
        return session;
      }).catch(function () { session = null; return null; });
    });
  }

  function onAuthChange(cb) {
    return makeClient().then(function (c) {
      return c.auth.onAuthStateChange(function (ev, s) {
        session = s || null;
        if (cb) cb(ev, session && session.user ? session.user : null);
      });
    });
  }

  function signIn(email, pass) {
    return makeClient().then(function (c) {
      return c.auth.signInWithPassword({ email: email, password: pass }).then(function (r) {
        if (r.error) throw r.error;
        session = r.data.session;
        return r.data;
      });
    });
  }

  function signUp(email, pass, meta) {
    return makeClient().then(function (c) {
      return c.auth.signUp({
        email: email, password: pass,
        options: { data: meta || {} }
      }).then(function (r) {
        if (r.error) throw r.error;
        if (r.data && r.data.session) session = r.data.session;
        return r.data;
      });
    });
  }

  function signOut() {
    session = null;
    return makeClient().then(function (c) { return c.auth.signOut(); })
      .catch(function () {});
  }

  function resetPassword(email) {
    return makeClient().then(function (c) {
      return c.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin + location.pathname
      }).then(function (r) { if (r.error) throw r.error; return r.data; });
    });
  }

  function updatePassword(newPass) {
    return makeClient().then(function (c) {
      return c.auth.updateUser({ password: newPass }).then(function (r) {
        if (r.error) throw r.error;
        return r.data;
      });
    });
  }

  function oauth(provider) {
    return makeClient().then(function (c) {
      return c.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: location.origin + location.pathname }
      }).then(function (r) { if (r.error) throw r.error; return r.data; });
    });
  }

  /* ---------- Messages d'erreur lisibles ---------- */
  function supaMsg(err) {
    var m = (err && (err.message || err.error_description || err.msg)) || 'Erreur inconnue.';
    m = String(m);
    if (/invalid login credentials/i.test(m)) return 'E-mail ou mot de passe incorrect.';
    if (/already registered|already exists|user already/i.test(m)) return 'Un compte existe déjà avec cette adresse e-mail.';
    if (/rate limit|too many/i.test(m)) return 'Trop de tentatives. Réessayez dans quelques minutes.';
    if (/password should be/i.test(m)) return 'Mot de passe trop faible (8 caractères minimum).';
    if (/email not confirmed/i.test(m)) return 'Confirmez d’abord votre adresse e-mail (lien reçu par mail).';
    if (/network|failed to fetch|load failed/i.test(m)) return 'Connexion au serveur impossible. Vérifiez votre connexion.';
    return m;
  }

  /* ---------- Hydratation du CMS (cloud → localStorage) ---------- */
  function hydrate() {
    if (!isConfigured()) return Promise.resolve({ changed: false });
    return makeClient().then(function (c) {
      hydrating = true;
      return c.from('cms').select('key,value').then(function (r) {
        hydrating = false;
        if (r.error) throw r.error;
        var changed = false;
        (r.data || []).forEach(function (row) {
          var prev = null;
          try { prev = localStorage.getItem(row.key); } catch (e) {}
          var next = JSON.stringify(row.value);
          if (prev !== next) {
            changed = true;
            try { localStorage.setItem(row.key, next); } catch (e) {}
          }
        });
        hydrated = true;
        return { changed: changed };
      }).catch(function (err) {
        hydrating = false;
        console.warn('[ORIXA] Hydratation Supabase impossible :', err && err.message);
        return { changed: false };
      });
    });
  }

  /* Clés réservées à l'admin (non lues par le public) */
  var PRIVATE_KEYS = ['orixa:users'];
  function visibilityFor(key) { return PRIVATE_KEYS.indexOf(key) !== -1 ? 'private' : 'public'; }

  /* ---------- Écriture (localStorage → Supabase) ---------- */
  function push(key, value) {
    if (!isConfigured() || !session || hydrating) return Promise.resolve();
    return makeClient().then(function (c) {
      return c.from('cms').upsert(
        { key: key, value: value, visibility: visibilityFor(key) },
        { onConflict: 'key' }
      ).then(function (r) {
          if (r.error) {
            if (r.error.code === '42501') {
              console.warn('[ORIXA] RLS : écriture refusée pour ' + key + ' (compte non autorisé).');
            } else {
              console.warn('[ORIXA] Écriture Supabase impossible :', r.error.message);
            }
          }
        }).catch(function (e) { console.warn('[ORIXA] push échec :', e); });
    });
  }

  /* ---------- Write-through (admin) ---------- */
  function patchAdminStore() {
    var A = window.OrixaAdmin;
    if (!A || !A.Store || A.Store.__patched) return;
    A.Store.__patched = true;
    var orig = A.Store.set;
    A.Store.set = function (k, v) {
      orig(k, v);
      if (CMS_KEYS.indexOf(k) !== -1) push(k, v);
    };
  }

  /* ---------- Prêt (les pages attendent OrixaBackend.ready) ---------- */
  var readyResolve = null;
  var ready = new Promise(function (res) { readyResolve = res; });

  function showPage() {
    try { document.documentElement.style.visibility = ''; } catch (e) {}
  }

  /* ---------- Garde du panneau d'administration ---------- */
  var IS_ADMIN = /\/admin\//.test(location.pathname);
  var IS_LOGIN = /\/admin\/login\.html/.test(location.pathname);

  function demoAuthed() {
    try { return sessionStorage.getItem('orixa:demo-admin') === '1'; } catch (e) { return false; }
  }

  function loginUrl() {
    return 'login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  }

  function gateAdmin() {
    // Filet de sécurité : la page ne reste jamais masquée.
    var safety = setTimeout(showPage, 7000);

    /* Mode démo : mot de passe local (voir GUIDE) */
    if (!isConfigured()) {
      if (demoAuthed()) { showPage(); clearTimeout(safety); readyResolve(); return; }
      location.replace(loginUrl());
      return;
    }

    /* Mode cloud : vérification de session Supabase */
    refreshSession().then(function () {
      var u = user();
      var ok = u && u.email &&
        String(u.email).toLowerCase() === String(CFG.ADMIN_EMAIL || '').toLowerCase();
      if (!ok) { location.replace(loginUrl()); return; }

      // Hydrate une fois, puis ne recharge que si le contenu a changé
      // (évite le double chargement à chaque navigation).
      var last = 0;
      try { last = +(sessionStorage.getItem('orixa:hydrated-at') || 0); } catch (e) {}
      if (Date.now() - last > 5000) {
        try { sessionStorage.setItem('orixa:hydrated-at', String(Date.now())); } catch (e) {}
        hydrate().then(function (res) {
          clearTimeout(safety);
          if (res && res.changed) { location.reload(); return; }
          showPage(); readyResolve();
        });
        return;
      }
      try { sessionStorage.removeItem('orixa:hydrated-at'); } catch (e) {}
      showPage(); clearTimeout(safety);
      readyResolve();
    }).catch(function () {
      showPage(); clearTimeout(safety);
      readyResolve();
    });
  }

  /* ---------- Démarrage (pages publiques + login admin) ---------- */
  function start() {
    if (started) return; started = true;
    if (!isConfigured()) { readyResolve(); return; }
    refreshSession().then(function () {
      return hydrate();
    }).then(function (res) {
      // Recharge une seule fois si le contenu a changé sur le cloud,
      // pour que toutes les pages (y compris leurs scripts inline)
      // affichent les données partagées. Jamais sur la page de
      // commande : un rechargement effacerait la saisie en cours.
      var skip = /\/admin\//.test(location.pathname) ||
        (document.querySelector && document.querySelector('[data-checkout]'));
      if (res && res.changed && !skip) {
        var last = 0;
        try { last = +(sessionStorage.getItem('orixa:hydrated-at') || 0); } catch (e) {}
        if (Date.now() - last > 5000) {
          try { sessionStorage.setItem('orixa:hydrated-at', String(Date.now())); } catch (e) {}
          location.reload();
          return; // la page va se recharger
        }
        try { sessionStorage.removeItem('orixa:hydrated-at'); } catch (e) {}
      }
      readyResolve();
    }).catch(function () { readyResolve(); });
  }

  /* ---------- Câblage ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    patchAdminStore();
  });

  if (IS_ADMIN && !IS_LOGIN) {
    gateAdmin();
  } else {
    start();
  }

  /* Déconnexion en direct : si la session expire pendant qu'on est
     dans l'admin, on renvoie vers l'écran de connexion. */
  if (IS_ADMIN && !IS_LOGIN && isConfigured()) {
    onAuthChange(function (ev) {
      if (ev === 'SIGNED_OUT') location.replace('login.html');
    });
  }

  /* ---------- API publique ---------- */
  window.OrixaBackend = {
    isConfigured: isConfigured,
    ready: ready,
    user: user,
    session: function () { return session; },
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    resetPassword: resetPassword,
    updatePassword: updatePassword,
    oauth: oauth,
    onAuthChange: onAuthChange,
    hydrate: hydrate,
    push: push,
    msg: supaMsg,
    CMS_KEYS: CMS_KEYS
  };
})();
