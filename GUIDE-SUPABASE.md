# 🔐 GUIDE ORIXA — Brancher Supabase (backend gratuit)

> Vous n'avez **jamais fait de backend** ? Parfait, ce guide est fait pour vous.
> Aucun code serveur à écrire : vous suivez des clics, je m'occupe du reste.

---

## En deux mots

| Avant (démo) | Après (Supabase) |
|---|---|
| L'admin est protégé par un simple mot de passe local | L'admin est protégé par Supabase Auth (mots de passe **chiffrés**, jamais dans le navigateur) |
| Les données du CMS restent dans **votre** navigateur | Les données sont **partagées entre tous les visiteurs** (base PostgreSQL) |
| N'importe qui peut lire le code et contourner | La RLS bloque toute écriture non-admin **côté serveur** |
| Pas de comptes clients | Inscription, connexion, **Google**, Apple, récupération de mot de passe |

> ℹ️ **Que devient le panier / les favoris ?** Ils restent **locaux** à chaque
> visiteur (localStorage) — c'est voulu : on ne partage jamais le panier des
> clients. Seul le **contenu CMS** (produits, thème, menu…) est partagé via
> Supabase. Les **commandes** (`orixa:orders`) restent elles aussi locales au
> navigateur de l'admin pour l'instant — à faire évoluer vers une table
> dédiée quand la boutique encaissera pour de vrai.

---

## Étape 1 — Créer le projet Supabase (gratuit, ~2 min)

1. Allez sur **https://supabase.com** → cliquez **Start your project** (ou *Sign in*).
2. Connectez-vous avec GitHub (le plus simple).
3. Créez une **organisation** (n'importe quel nom, ex. « Orixa »).
4. **New project** :
   - **Name** : `orixa`
   - **Database password** : cliquez sur *Generate a password* et **copiez-le** dans un fichier (utile plus tard). 
   - **Region** : `West EU (Ireland)` ou `Central EU (Frankfurt)`.
   - **Pricing plan** : **Free** (gratuit).
5. Cliquez **Create new project** et attendez 1 à 2 minutes que la base soit prête.

---

## Étape 2 — Récupérer l'URL et la clé « anon »

1. Dans votre projet, ouvrez **Settings ⚙️ → API** (menu en bas à gauche).
2. Copiez deux valeurs :
   - **Project URL** : `https://XXXXXXXX.supabase.co`
   - **anon public** (la clé commence par `eyJ...`)
3. Ouvrez `assets/js/config.js` et collez-les :

```js
window.ORIXA_CONFIG = {
  SUPABASE_URL: 'https://XXXXXXXX.supabase.co',   // ← votre URL
  SUPABASE_ANON_KEY: 'eyJ...',                     // ← votre clé anon
  ADMIN_EMAIL: 'admin@2026.fr',
  DEMO_ADMIN_PASSWORD: 'Azerty@2026Orixa'          // ne sert plus qu'en secours
};
```

> ⚠️ La clé **anon** est faite pour être publique (elle est dans le navigateur de tous).
> Elle ne donne **aucun** droit d'écriture grâce à la RLS. Ne confondez pas avec la clé
> **service_role** (secrète) : ne la mettez **jamais** dans le site.

---

## Étape 3 — Créer la table + la sécurité (2 clics)

1. Dans Supabase, ouvrez **SQL Editor** (menu de gauche).
2. Cliquez **New query**, collez **tout** le contenu du fichier `supabase/schema.sql`.
3. Cliquez **Run** → vous devez voir `Success. No rows returned`.

C'est fait : la table `cms` (clé/valeur) existe avec une colonne
`visibility` (`public`/`private`). Les lignes **publiques** (produits, thème,
menu…) sont lues par tous ; les lignes **privées** (ex. la liste des
utilisateurs `orixa:users`) ne sont lisibles que par l'admin. L'écriture est
réservée à `admin@2026.fr`.

---

## Étape 4 — Créer le compte administrateur

1. Menu de gauche : **Authentication → Users**.
2. Cliquez **Add user** (ou *Invite user*) :
   - **Email** : `admin@2026.fr`
   - **Password** : `Azerty@2026Orixa` (ou le mot de passe fort de votre choix)
3. Cliquez **Create user**.
   - Si vous utilisez *Invite*, vous recevrez un e-mail de confirmation : cliquez le lien.

> Seul cet e-mail exact a le droit d'écrire dans la base (c'est la RLS du
> `schema.sql`). Si vous changez l'e-mail, changez-le **aussi** dans le SQL
> (les 3 lignes `cms_insert_admin`, `cms_update_admin`, `cms_delete_admin`)
> **et** dans `config.js`.

---

## Étape 5 — Activer la connexion Google (et Apple) pour les clients

1. Menu de gauche : **Authentication → Providers**.
2. **Email** : laissez activé (cocher aussi *Confirm email* est recommandé).
3. **Google** : cliquez sur **Edit** à côté de Google, puis **Enable Sign in with Google**.
   - Google vous demandera un **OAuth Client ID** et un **Client Secret** :
     - Allez sur **https://console.cloud.google.com** → *APIs & Services* → *Credentials* → *Create Credentials* → **OAuth client ID** → *Web application*.
     - **Authorized redirect URI** : copiez celle affichée par Supabase (elle ressemble à `https://XXXXXXXX.supabase.co/auth/v1/callback`).
     - Collez le Client ID et le Secret dans Supabase → **Save**.
   - 💡 Si cela vous semble long, c'est normal : c'est Google qui le demande, une seule fois. Vous pouvez commencer avec l'e-mail/mot de passe et activer Google plus tard.
4. **Apple** : même principe (demande un compte développeur Apple, optionnel).

---

## Étape 6 — Autoriser votre domaine (Vercel)

> ⚠️ **ÉTAPE OBLIGATOIRE — c'est elle qui rend la confirmation d'e-mail fonctionnelle.**
> Par défaut, le « Site URL » de Supabase est `http://localhost:3000`. Si vous ne le
> changez pas, le lien de confirmation envoyé par e-mail s'ouvre sur `localhost:3000`
> (page vide) → le compte n'est **jamais confirmé** → la connexion échoue ensuite
> avec « E-mail ou mot de passe incorrect ». Symptômes à connaître :
> l'URL du navigateur devient `http://localhost:3000/?code=…` après inscription.

1. Dans Supabase : **Authentication → URL Configuration**.
2. **Site URL** : votre boutique, ex. `https://orixa-mu.vercel.app`.
3. **Redirect URLs** : ajoutez
   - `https://orixa-mu.vercel.app/**`
   - `http://localhost:8000/**` (pour tester en local)
   - `http://localhost:8018/**` (si vous testez sur ce port)
4. **Cliquez Save.**
5. Après avoir changé le Site URL, **refaites une inscription de test** : le lien de
   confirmation doit maintenant ouvrir `https://orixa-mu.vercel.app/compte/index.html`
   avec le message vert « Adresse e-mail confirmée ».

> 💡 **Si des comptes ont déjà été créés avant ce réglage** (donc non confirmés) :
> supprimez-les dans **Authentication → Users** et recréez-les, ou invitez-les à
> nouveau. Un compte non confirmé ne peut pas se connecter.

---

## Étape 7 — Déployer et tester

1. Poussez les changements sur GitHub (Vercel redéploie automatiquement).
2. Ouvrez la boutique : le contenu est maintenant chargé depuis la base.
3. Ouvrez `/admin/` :
   - Sans session → **redirection vers l'écran de connexion**.
   - Connectez-vous avec `admin@2026.fr` / votre mot de passe → vous arrivez sur le tableau de bord.
4. Modifiez un produit : il est **immédiatement visible par tous les visiteurs** (ouvrez la boutique dans un autre navigateur pour vérifier).
5. Sur `/compte/` : inscrivez un client, connectez-vous avec Google… tout fonctionne.

---

## 🔎 Ce qui se passe concrètement (pour votre culture)

- `supabase.js` charge le SDK officiel, restaure la session, puis **hydrate** le CMS :
  la table `cms` est lue et copiée dans le stockage local du navigateur pour que le
  site (HTML statique) l'affiche instantanément.
- Quand vous enregistrez un changement dans l'admin, il est écrit **en local d'abord**
  (réactivité) puis **poussé vers Supabase** (write-through).
- La **RLS** vérifie *côté serveur* que l'e-mail de la session est bien `admin@2026.fr`
  avant toute écriture. Même un visiteur qui falsifierait son navigateur ne peut rien écrire.
- La garde admin (`gateAdmin`) redirige tout visiteur non connecté vers `login.html`.
  C'est une protection d'interface ; la **vraie** sécurité des données, c'est la RLS.

---

## 🧪 Tester sans rien casser (mode démo)

Tant que `SUPABASE_URL` est vide dans `config.js`, le site fonctionne exactement
comme avant (localStorage). L'admin reste protégé par le mot de passe de
démonstration `Azerty@2026Orixa` — parfait pour développer. Passez en mode cloud
en collant vos valeurs, et revenez en démo en les vidant.

---

## ❓ Dépannage

| Problème | Solution |
|---|---|
| « RLS : écriture refusée » dans la console | Le compte connecté n'est pas `admin@2026.fr` (ou la RLS a un autre e-mail). Vérifiez Étape 4 + le SQL. |
| L'admin me renvoie toujours au login | L'e-mail de session ne correspond pas à `ADMIN_EMAIL`. Déconnectez-vous, reconnectez-vous avec le bon compte. |
| Le site ne montre pas les nouvelles données | L'hydratation recharge la page si le contenu change. Si besoin, recharger manuellement (Ctrl+F5). |
| « CDN bloqué » en local hors-ligne | Le SDK est chargé depuis jsDelivr uniquement en mode cloud. En mode démo, aucun SDK n'est requis. En production, si le CDN est bloqué, le site retombe sur ses données locales en attendant. |
| Google ne marche pas | Vérifiez l'URI de redirection Google (Étape 5) et les Redirect URLs (Étape 6). |
| Après inscription, le navigateur affiche `localhost:3000/?code=…` | Le **Site URL** est encore la valeur par défaut de Supabase. Corrigez-le (Étape 6) puis **recréez le compte**. |
| « E-mail ou mot de passe incorrect » juste après inscription | Le compte n'est pas **confirmé** (lien de confirmation non cliqué ou Site URL non corrigé). Refaites l'inscription après l'Étape 6, cliquez le lien reçu, puis connectez-vous. |
| Je veux tout remettre à zéro | Dans Supabase → Table editor → `cms` → supprimez les lignes ; le site repart sur ses données par défaut. |
| Le lien « mot de passe oublié » ne fonctionne pas | Vérifiez la **Redirect URL** dans Authentication → URL Configuration : ajoutez `https://votre-site.vercel.app/compte/mot-de-passe-oublie.html` (et `http://localhost:8000/…` en local).

---

## 🧯 Sécurité — récapitulatif de la revue

1. **Admin** : plus aucun lien « Administration » dans le footer public (déjà retiré).
2. **Mots de passe** : jamais stockés dans le navigateur — Supabase les chiffre (bcrypt) côté serveur.
3. **RLS** : écriture serveur réservée à l'admin, même si le code client est contourné.
4. **XSS** : les champs CMS sont affichés via `textContent`/échappement dans la plupart des cas ;
   pour les contenus riches (éditeur), gardez l'éditeur réservé à l'admin de confiance.
5. **CORS** : Supabase gère les domaines autorisés (Étape 6).
6. **Brute-force** : Supabase inclut une protection de débit sur les tentatives de connexion.
