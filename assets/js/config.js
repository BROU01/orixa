/* =========================================================
   ORIXA — config.js
   Configuration centrale du site (backend Supabase + admin).

   ▶ MODE DÉMO (par défaut) :
     Tant que SUPABASE_URL et SUPABASE_ANON_KEY sont vides,
     le site fonctionne en local (localStorage) et l'écran de
     connexion admin utilise le mot de passe de démonstration.
     C'est un mode de secours : la sécurité réelle exige
     Supabase (voir GUIDE-SUPABASE.md à la racine).

   ▶ MODE PRODUCTION :
     1. Créez un projet sur https://supabase.com
     2. Copiez l'URL du projet et la clé « anon public » ci-dessous
     3. Exécutez supabase/schema.sql dans l'éditeur SQL
     4. Créez l'utilisateur admin (email + mot de passe) dans
        Authentication → Users
     5. Déployez sur Vercel : tout le monde verra alors les
        mêmes données CMS, partagées depuis la base Supabase.
   ========================================================= */
window.ORIXA_CONFIG = {
  /* --- Supabase (collez vos valeurs ici) ------------------ */
  SUPABASE_URL: '',      // ex. : 'https://abcdefgh.supabase.co'
  SUPABASE_ANON_KEY: '', // ex. : 'eyJhbGciOiJIUzI1NiIs...'

  /* --- Compte administrateur ------------------------------ */
  // Email autorisé à se connecter au panneau d'administration.
  // Ce compte doit être créé dans Supabase (Auth → Users) avec
  // le mot de passe de votre choix. Les autres comptes (clients)
  // n'ont PAS accès à l'administration.
  ADMIN_EMAIL: 'admin@2026.fr',

  /* --- Repli démo (UNIQUEMENT si Supabase n'est pas configuré) --
     Mot de passe local utilisé par l'écran de connexion admin en
     mode démo. ⚠️ Contournable côté client — remplacez-le par
     Supabase avant toute mise en production réelle. */
  DEMO_ADMIN_PASSWORD: 'Azerty@2026Orixa'
};
