# ORIXA — Next.js + TypeScript

Boutique e-commerce pour cosmétiques naturels et produits exotiques.
Refonte du site statique HTML/JS vers Next.js avec TypeScript et protection admin server-side.

## 🔒 Sécurité

- **Admin protégé côté serveur** via le middleware Next.js (pas contournable par JavaScript)
- **Pas de mots de passe dans le frontend** — les secrets sont dans `.env.local`
- **RLS Supabase** — lecture publique, écriture admin uniquement
- **Auth Supabase** — sessions sécurisées avec PKCE flow

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
│   └── middleware.ts           # Protection admin (server-side)
├── .env.local                  # Variables d'environnement (SECRET)
├── .env.example                # Modèle pour .env.local
├── next.config.js              # Configuration Next.js
├── tsconfig.json               # Configuration TypeScript
└── package.json
```

## 🔐 Protection Admin

Le middleware Next.js (`src/middleware.ts`) vérifie **côté serveur** que :
1. L'utilisateur est authentifié via Supabase
2. Son email correspond à l'adresse admin configurée

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
