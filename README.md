# ORIXA — Next.js + TypeScript

Boutique e-commerce pour cosmétiques naturels et produits exotiques.
Refonte du site statique HTML/JS vers Next.js avec TypeScript et protection admin server-side.

## 🔒 Sécurité

- **Admin protégé côté serveur** via le middleware Next.js (pas contournable par JavaScript)
- **Mode démo admin protégé par session HMAC** — secret serveur obligatoire, cookie HttpOnly et expiration
- **Pas de mots de passe dans le frontend** — les secrets sont dans `.env.local`
- **RLS Supabase** — lecture publique, écriture admin uniquement
- **Auth Supabase** — sessions sécurisées avec PKCE flow
- **Rate limiting** par IP et par compte sur les flux d’authentification, à compléter par un WAF ou Redis distribué en production

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
cd orixa
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# Remplir les valeurs Supabase dans .env.local

# 3. Lancer le serveur de développement
npm run dev
```

## 📁 Structure

```
orixa/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Accueil
│   │   ├── globals.css         # Styles globaux
│   │   ├── admin/              # Pages admin (protégées par middleware)
│   │   │   ├── layout.tsx      # Layout admin avec sidebar
│   │   │   ├── page.tsx        # Dashboard
│   │   │   └── login/          # Connexion admin
│   │   ├── boutique/           # Page boutique
│   │   ├── compte/             # Compte client (login/inscription)
│   │   └── ...                 # Autres pages
│   ├── lib/
│   │   ├── supabase.ts         # Client Supabase
│   │   └── data.ts             # Fonctions de récupération des données
│   ├── types/
│   │   └── index.ts            # Types TypeScript
│   └── proxy.ts                # Protection admin (server-side)
├── .env.local                  # Variables d'environnement (SECRET)
├── .env.example                # Modèle pour .env.local
├── next.config.js              # Configuration Next.js
├── tsconfig.json               # Configuration TypeScript
└── package.json
```

## 🔐 Protection Admin

Le proxy Next.js (`src/proxy.ts`) vérifie **côté serveur** que :
1. L'utilisateur est authentifié via Supabase et son email correspond à l'adresse admin configurée ; ou
2. En mode démo, le cookie HMAC est valide, non expiré et associé à l'adresse admin configurée.

Si Supabase n'est pas configuré, l'accès admin reste refusé tant que `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` ne sont pas renseignés. Une erreur de vérification est traitée en **fail-closed** et ne donne jamais accès au panneau.

Si ces conditions ne sont pas remplies, il redirige vers `/admin/login`.

**Contrairement au site statique**, cette protection n'est PAS contournable par :
- Désactivation de JavaScript
- Modification de sessionStorage
- Accès direct aux fichiers

## 📦 Variables d'environnement

| Variable | Description | Côté |
|----------|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Client + Serveur |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase | Client + Serveur |
| `ADMIN_EMAIL` | Email de l'administrateur | Serveur uniquement |
| `ADMIN_PASSWORD` | Mot de passe du mode démo admin | Serveur uniquement |
| `ADMIN_SESSION_SECRET` | Secret HMAC aléatoire d'au moins 32 caractères | Serveur uniquement |
| `NEXT_PUBLIC_SITE_URL` | URL publique utilisée pour les liens d'authentification | Client + Serveur |

## 🔄 Migration depuis le site statique

Le code source original est conservé dans `orixa-legacy/` pour référence.
Les fonctionnalités sont progressivement migrées vers les composants React.

## 🛠️ Développement

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Démarrer le build
npm run type-check   # Vérification TypeScript
npm run lint         # Linting
```

## 🧪 Vérification de sécurité locale

Après un build de production, un test non destructif des contrôles admin peut être lancé avec une instance locale isolée :

```bash
npm run build
NODE_ENV=production \
ADMIN_EMAIL='security-test@example.invalid' \
ADMIN_PASSWORD='mot-de-passe-de-test-local' \
ADMIN_SESSION_SECRET='secret-local-d-au-moins-32-caracteres-aleatoires' \
npm start -- -p 3005

BASE_URL=http://localhost:3005 ./security-smoke.sh
```

Le script vérifie notamment la redirection sans session, le rate limiting, le cookie HttpOnly/Secure/SameSite, l’accès avec un jeton HMAC valide et le refus d’un jeton falsifié. Il ne doit être exécuté que sur une instance locale ou de préproduction.

Le rate limiting en mémoire protège une instance unique. En production serverless ou multi-instance, il doit être complété par un WAF/CDN et un stockage distribué tel que Redis/Upstash ; aucun dépôt de code ne peut garantir à lui seul une résistance absolue à un déni de service ou à des identifiants compromis.
