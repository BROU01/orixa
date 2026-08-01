/* ORIXA — auth.js
   Validation cliente + câblage Supabase pour la connexion,
   l'inscription et le mot de passe oublié des clients.
   Sans Supabase configuré (config.js), un message clair
   invite à suivre GUIDE-SUPABASE.md. */
(function () {
  'use strict';

  var B = window.OrixaBackend;

  function err(input, el, msg) {
    if (!input || !el) return;
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      el.textContent = msg;
      el.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      el.textContent = '';
      el.hidden = true;
    }
  }

  const isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  const isTel = function (v) { return /^[+()\d\s.-]{8,}$/.test(v); };

  /* Note contextuelle (backend non configuré, succès, etc.) */
  function authNote(form, msg) {
    var old = form.querySelector('.auth-note');
    if (old) old.remove();
    var n = document.createElement('p');
    n.className = 'auth-note';
    n.setAttribute('role', 'status');
    n.setAttribute('aria-live', 'polite');
    n.textContent = msg;
    form.appendChild(n);
  }

  /* Toggle mot de passe (toutes les pages) */
  document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
    const input = document.getElementById(btn.getAttribute('data-toggle-password'));
    if (!input) return;
    const on = btn.querySelector('.i-eye');
    const off = btn.querySelector('.i-eye-off');
    btn.addEventListener('click', function () {
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      btn.setAttribute('aria-label', hidden ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      if (on && off) { on.hidden = hidden; off.hidden = !hidden; }
      input.focus();
    });
  });

  /* Nettoyage de l'erreur à la saisie */
  document.querySelectorAll('.gfield__input').forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.hasAttribute('aria-invalid')) {
        err(input, document.getElementById(input.id + '-error'), '');
      }
    });
  });

  function submitState(form, label) {
    const b = form.querySelector('button[type=submit]');
    if (!b) return function () {};
    const original = b.textContent;
    b.disabled = true;
    b.textContent = label;
    return function () { b.disabled = false; b.textContent = original; };
  }

  function focusFirstError(form) {
    const el = form.querySelector('[aria-invalid="true"]');
    if (el) el.focus();
  }

  /* ---------- Connexion ---------- */
  const login = document.getElementById('login-form');
  if (login) {
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = login.querySelector('#email');
      const pass = login.querySelector('#password');
      let bad = false;

      if (!email.value.trim()) { err(email, document.getElementById('email-error'), 'Merci d’entrer votre adresse e-mail.'); bad = true; }
      else if (!isEmail(email.value.trim())) { err(email, document.getElementById('email-error'), 'Format d’e-mail invalide.'); bad = true; }
      else err(email, document.getElementById('email-error'), '');

      if (!pass.value) { err(pass, document.getElementById('password-error'), 'Merci d’entrer votre mot de passe.'); bad = true; }
      else if (pass.value.length < 6) { err(pass, document.getElementById('password-error'), 'Au moins 6 caractères.'); bad = true; }
      else err(pass, document.getElementById('password-error'), '');

      if (bad) return focusFirstError(login);

      const reset = submitState(login, 'Connexion…');

      if (!B || !B.isConfigured()) {
        reset();
        authNote(login, 'Le backend client n’est pas configuré. Suivez GUIDE-SUPABASE.md pour activer les comptes clients (inscription, Google, etc.).');
        return;
      }

      B.signIn(email.value.trim(), pass.value).then(function () {
        reset();
        location.href = '../index.html';
      }).catch(function (x) {
        reset();
        err(email, document.getElementById('email-error'), B.msg(x));
      });
    });
  }

  /* ---------- Inscription ---------- */
  const signup = document.getElementById('signup-form');
  if (signup) {
    signup.addEventListener('submit', function (e) {
      e.preventDefault();
      const nom = signup.querySelector('#nom');
      const email = signup.querySelector('#email');
      const tel = signup.querySelector('#tel');
      const pass = signup.querySelector('#password');
      const cgv = signup.querySelector('#cgv');
      let bad = false;

      if (nom.value.trim().length < 2) { err(nom, document.getElementById('nom-error'), 'Merci d’indiquer votre nom.'); bad = true; }
      else err(nom, document.getElementById('nom-error'), '');

      if (!isEmail(email.value.trim())) { err(email, document.getElementById('email-error'), 'Format d’e-mail invalide.'); bad = true; }
      else err(email, document.getElementById('email-error'), '');

      if (!isTel(tel.value.trim())) { err(tel, document.getElementById('tel-error'), 'Numéro de téléphone invalide.'); bad = true; }
      else err(tel, document.getElementById('tel-error'), '');

      if (pass.value.length < 8 || !/\d/.test(pass.value)) {
        err(pass, document.getElementById('password-error'), '8 caractères minimum, dont au moins un chiffre.');
        bad = true;
      } else err(pass, document.getElementById('password-error'), '');

      const cgvErr = document.getElementById('cgv-error');
      if (!cgv.checked) {
        cgvErr.textContent = 'Vous devez accepter les conditions de vente.';
        cgvErr.hidden = false;
        bad = true;
      } else { cgvErr.hidden = true; }

      if (bad) return focusFirstError(signup);

      const reset = submitState(signup, 'Création…');

      if (!B || !B.isConfigured()) {
        reset();
        authNote(signup, 'Le backend client n’est pas configuré. Suivez GUIDE-SUPABASE.md pour activer l’inscription.');
        return;
      }

      B.signUp(email.value.trim(), pass.value, {
        full_name: nom.value.trim(),
        phone: tel.value.trim()
      }).then(function (data) {
        reset();
        // Si la confirmation par e-mail est activée, l'utilisateur doit
        // cliquer le lien reçu avant de pouvoir se connecter.
        authNote(signup, (data && data.session)
          ? 'Compte créé. Vous êtes connecté(e) — bienvenue chez ORIXA !'
          : 'Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.');
        if (data && data.session) setTimeout(function () { location.href = '../index.html'; }, 1400);
      }).catch(function (x) {
        reset();
        err(email, document.getElementById('email-error'), B.msg(x));
      });
    });
  }

  /* ---------- Mot de passe oublié ---------- */
  const forgot = document.getElementById('forgot-form');
  if (forgot) {
    forgot.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = forgot.querySelector('#email');
      if (!isEmail(email.value.trim())) {
        err(email, document.getElementById('email-error'), 'Format d’e-mail invalide.');
        return focusFirstError(forgot);
      }
      err(email, document.getElementById('email-error'), '');

      const reset = submitState(forgot, 'Envoi…');

      if (!B || !B.isConfigured()) {
        reset();
        authNote(forgot, 'Le backend n’est pas configuré. Suivez GUIDE-SUPABASE.md pour activer la récupération de mot de passe.');
        return;
      }

      B.resetPassword(email.value.trim()).then(function () {
        reset();
        forgot.hidden = true;
        const done = document.getElementById('forgot-done');
        if (done) { done.hidden = false; done.setAttribute('tabindex', '-1'); done.focus(); }
      }).catch(function (x) {
        reset();
        err(email, document.getElementById('email-error'), B.msg(x));
      });
    });
  }

  /* ---------- Connexion sociale (Google, Apple…) ---------- */
  document.querySelectorAll('[data-oauth]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var provider = btn.getAttribute('data-oauth');
      if (!B || !B.isConfigured()) {
        var f = btn.closest('form');
        authNote(f || document.body, 'La connexion ' + provider + ' nécessite Supabase. Suivez GUIDE-SUPABASE.md (section « Fournisseurs de connexion »).');
        return;
      }
      btn.disabled = true;
      B.oauth(provider).catch(function (x) {
        btn.disabled = false;
        var f = btn.closest('form');
        authNote(f || document.body, B.msg(x));
      });
    });
  });

  /* Année dynamique */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
