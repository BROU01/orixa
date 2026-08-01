# ORIXA — Document de transmission pour Claude

> **À LIRE INTÉGRALEMENT AVANT TOUTE MODIFICATION DU PROJET.**
>
> Ce document est destiné à **Claude**, qui a créé le projet initial (version 0),
> puis à toute IA qui reprendra le projet. Il transcrit **de A à Z toutes les
> mises à jour apportées au projet** depuis la version 0, ainsi que le contexte
> client corrigé. Le projet est re-soumis à Claude **zippé** avec ce fichier.

---

## 0. ⚠️ FAITS ESSENTIELS — CORRECTIONS DE CAP (à ne pas défaire)

Le projet initial contenait des informations **erronées ou obsolètes** qui ont
été corrigées. Les anciens fichiers `.md` archivés dans le projet (ou fournis
séparément) **ne doivent PAS être suivis** sur ces points :

| Sujet | AVANT (faux / obsolète) | APRÈS (correct — à respecter) |
|---|---|---|
| **Nom de la boutique** | Parfois écrit « KALIPE » | **ORIXA** — toujours, partout. KALIPE est le **prénom de la tante**, PAS la marque. |
| **Localisation** | Togo / Afrique | La boutique est une **maison française**. La cliente (la tante) **réside en France**. Livraison partout en Europe. |
| **Cliente** | — | La cliente est **la tante** (Kalipé / « La Grâce »), propriétaire de la boutique ORIXA. |
| **Activité connexe** | — | « Maroquinerie La Grâce » : activité liée à la cliente, à garder en tête comme contexte personnel (ne pas l'intégrer au site sauf demande explicite). |
| **Archives md** | Anciennes versions | Obsolètes pour la localisation, le nom, la procédure. **S'en servir uniquement comme contexte historique.** |

**Règles d'or :**
1. Le nom de la boutique est **ORIXA**, jamais KALIPE.
2. La boutique est **française**, la cliente réside en France — pas de Togo, pas
   d'« Afrique » comme localisation de la boutique (les produits, eux, ont des
   origines réelles : Burkina Faso, Côte d'Ivoire, Maroc, etc.).
3. Ne pas supprimer les améliorations décrites ci-dessous.
4. Le back-office doit rester un **CMS complet et éditable** (produits, rayons,
   prix, photos, descriptions, devise, menu, sections, thème…).

---

## 1. Le projet en bref

- **ORIXA** : e-commerce statique (HTML/CSS/JS, sans build, sans npm) avec un
  **CMS complet en localStorage** côté navigateur.
- 28 produits réels liés à de vrais visuels (`/products`), 6 devises, panier,
  favoris, tunnel de commande, back-office de 14 écrans.
- **30 pages** au total (front + admin + compte), zéro lien cassé (scanner validé).
- Tout est persistant en `localStorage` ; un export/import JSON complet existe
  dans `admin/reglages.html`.

---

## 2. HISTORIQUE COMPLET DES MISES À JOUR — de A à Z

### A. Refonte du footer public (toutes les pages front)

La critique senior du footer a été entièrement appliquée :

- **Structure sémantique** : `<footer class="site-footer">` avec grille CSS pour
  les colonnes, `<nav>` + `<ul>/<li>` par colonne, titres `<h3>/<h4>`, `<hr>`
  décoratifs, SVG pour les badges de paiement avec `aria-label`.
- **Colonnes corrigées :**
  - *La maison* : Notre histoire, Nos valeurs, Nos producteurs (liens corrects
    vers `histoire.html#...`).
  - *Boutique* : Cosmétiques, Produits exotiques, Nouveautés (les 3 pages
    dédiées, créées à l'itération B).
  - *Services* : Livraison, Retours, FAQ → `contact.html#livraison|retours|faq`.
  - *Mon compte* : **Mes favoris uniquement** — le lien « Connexion » a été
    retiré du footer, ainsi que « Mes commandes » (redondant avec le panier).
  - *Informations* : CGV, RGPD (lien « Cookies » **dédupliqué**, conservé
    uniquement dans la barre de copyright).
- **Paiements vs livraison séparés** : « Paiements sécurisés » (Visa, Mastercard,
  PayPal, Wero, Virement) ≠ « Mode de livraison » (Mondial Relay).
- **Sécurité** : suppression du lien « Administration » du footer public (une
  faille : l'URL d'admin ne doit jamais être exposée sur le storefront).
- **Accessibilité WCAG AA** : contraste des liens assombri sur fond crème
  (ratio ≥ 4,5:1).
- Le footer a été reconstruit sur **toutes** les pages front, y compris les
  3 nouvelles pages de catégories.

### B. Navigation : pages par catégorie + suppression du méga-menu et de l'option « Catalogue »

- **Création de 3 pages de catégories** : `cosmetiques.html`, `exotiques.html`,
  `nouveautes.html` — chacune avec son `<title>`, meta description, fil
  d'Ariane, pills de rayons, compteur et grille produits.
- **Navbar à plat** (menu CMS par défaut dans `theme.js`) :
  `Accueil · Cosmétiques · Produits exotiques · Nouveautés · Notre histoire · Contact`.
- **Supprimé** : le méga-menu « Boutique » (l'ancien `nav__panel`) **et** l'option
  « Catalogue » dans la navbar. Chaque catégorie a **sa propre page** affichée
  directement dans la navbar — pas de méga-menu, pas d'entrée « Boutique »
  générique.
- Vérifié en test headless : `6 nav__link`, `0 nav__panel`.

### C. Hero plein écran à l'atterrissage

- La bannière d'accueil (`type: hero`, `height: full`) occupe **100svh** :
  à l'arrivée on ne voit que navbar + bandeau vidéo plein écran ; la section
  « Parcourir le catalogue » n'apparaît qu'au défilement.
- Vidéo hero : `assets/video/hero.mp4` (avec `poster`), overlay réglable.

### D. Back-office : sidebar rétractable + nettoyage « AI-slop »

- **Sidebar admin rétractable** (icônes seules) : bouton chevron dans
  `side__brand`, état persistant en localStorage (`orixa:admin-side`), mode
  compact 64 px, accessibilité (`title`/`aria-label` sur les liens repliés).
  CSS : `.admin[data-side="off"] …` dans `admin.css` ; logique dans `admin.js`
  (`initSidebar`).
- **Suppression des barres colorées en dégradé** en tête de chaque page du
  sidebar (effet « AI-slop ») : le sidebar est désormais sobre (fond sombre
  uniforme, liens neutres, accent or sur l'élément actif).
- Aucun dégradé flashy dans l'admin ; direction visuelle épurée.

### E. Pages de rayon AUTO-GÉNÉRÉES (CMS)

- **`rayon.html` (nouvelle page, racine)** : template dynamique
  `rayon.html?id=<slug>` qui génère automatiquement la page de **n'importe quel
  rayon** créé dans l'admin :
  - titre, fil d'Ariane, description, pills de rayons dynamiques, compteur,
    grille de produits filtrée, tri, bandeau de couverture, état vide propre.
  - XSS protégé (`esc()` / `textContent`).
- **`admin/rayons.html`** : chaque rayon a **sa page** — colonne URL, bouton
  « Page » qui l'ouvre, `pageUrl()` (mappe `cosmetiques.html` /
  `exotiques.html` pour les 2 rayons historiques, sinon `rayon.html?id=`).
  Suppression de la constante morte `PAGES_EXISTANTES`.
- Les cartes de rayons de l'accueil (`theme.js`) pointent vers
  `rayon.html?id=` pour les rayons sans page statique ; le fil d'Ariane de
  `produit.html` fait de même en repli.
- **Bandeau de couverture** : champ « Image de couverture » par rayon (miniature
  dans le tableau admin, sauvegarde de `c.image`), affiché en grand bandeau avec
  voile sombre sur la page du rayon.
- **Tri des produits** sur la page rayon : Par défaut / Prix croissant /
  Prix décroissant / Nouveautés d'abord.

### F. Devise multi-devises (conversion réelle)

- **Source unique de vérité** : `window.ORIXA_CURRENCIES` dans `catalog.js`
  (6 devises : EUR 1, XOF 655,957, USD 1,09, GBP 0,86, CHF 0,94, MAD 10,8 —
  symboles, locales, position du symbole `pos`, taux).
- `formatPrice` (admin) **et** `OrixaFmt.prix` (front) appliquent
  `montant × taux` avec `Intl.NumberFormat` (locale + symbole + position).
- **`admin/reglages.html`** : aperçu en direct (15,90 € → devise choisie) et
  synchronisation de la position du symbole (`s-currencyPosition = curr.pos`)
  au changement de devise.
- Correctifs de cohérence : `commande.html` et `favoris.html` utilisent le
  catalogue CMS (`OrixaProducts()`) au lieu de données statiques.

### G. Sélecteur de devise CÔTÉ CLIENT

- **`window.OrixaCurrency`** (`catalog.js`) : devise effective =
  **préférence visiteur** (`orixa:visitor-currency`) > **devise du site**
  (réglages admin) > EUR (repli).
- **Sélecteur injecté** par `site.js` (`initCurrencyPicker`) :
  - dans le **header** (icône globe + liste déroulante) ;
  - dans le **menu mobile** (ligne « Devise »).
  - au changement : sauvegarde + `location.reload()` ; **masqué sur la page de
    commande** (`[data-checkout]`) pour ne pas effacer la saisie du formulaire.
- L'admin reste sur la devise du site ; la préférence visiteur n'affecte que le
  front. Styles : `.currency-pick`, `.mobile-nav__currency` dans `site.css`.

### H. Autres correctifs de cohérence et validation

- **`commande.html` / `favoris.html`** : branchement sur le catalogue effectif
  (les produits édités dans l'admin s'y reflètent).
- **Validations systématiques** (à rejouer après chaque modification) :
  - `node --check` sur les 6 fichiers JS (`ALL_OK`) ;
  - scanner de liens : **30 pages, zéro lien cassé** ;
  - tests Chrome headless (menu à plat, hero 100svh, rayon auto-généré,
    conversion FCFA, sélecteurs devise, footer sans lien admin) — **tous verts**.

---

## 3. État actuel du projet — architecture

```
orixa/
├── index.html            Accueil — composée de sections modifiables (CMS)
├── boutique.html         Catalogue complet : filtres rayon/prix/stock + tri
├── cosmetiques.html      PAGE DÉDIÉE catégorie Cosmétiques   (créée)
├── exotiques.html        PAGE DÉDIÉE catégorie Produits exotiques (créée)
├── nouveautes.html       PAGE DÉDIÉE Nouveautés              (créée)
├── rayon.html            PAGE AUTO-GÉNÉRÉE pour tout rayon (rayon.html?id=slug) (créée)
├── produit.html          Fiche produit (?id=karite)
├── histoire.html         Notre histoire (contenu CMS, admin/pages.html)
├── contact.html          Contact, livraison, retours, FAQ (contenu CMS)
├── legal.html            Mentions, CGV, confidentialité, RGPD, cookies (contenu CMS)
├── favoris.html          Favoris client
├── commandes.html        Historique client
├── commande.html         Tunnel de commande (Stripe / PayPal / Wero / virement)
│
├── compte/               3 pages d'authentification (carte de verre sur fond photo)
│   ├── index.html        Connexion — carte translucide centrée, backdrop blur
│   ├── inscription.html
│   └── mot-de-passe-oublie.html
│
├── admin/                14 écrans (voir §4)
├── design-demos/         Explorations design (voir §6) — NON branchées
│   ├── 01-noir-or.html
│   ├── 02-creme-elegance.html
│   └── 03-editorial-contemporain.html
│
├── assets/
│   ├── css/site.css      Design system front (incl. currency-pick, rayon-hero, sort)
│   ├── css/auth.css      Pages d'authentification
│   ├── css/admin.css     Back-office (incl. sidebar rétractable)
│   ├── js/catalog.js     SOURCE UNIQUE : produits, catégories, devises, OrixaCurrency, OrixaFmt
│   ├── js/theme.js       MOTEUR CMS : schémas de sections, rendu, menus, thème
│   ├── js/site.js        Front : rendu, panier, favoris, sélecteur devise, cookies
│   ├── js/editor.js      Constructeur de pages
│   ├── js/admin.js       État back-office, devise, sidebar rétractable
│   ├── js/auth.js        Validation des formulaires
│   └── video/hero.mp4    Vidéo hero plein écran
│
└── products/             28 visuels (cosmetics/ + exotic/)
```

**Convention de chargement** : `catalog.js` → `theme.js` → (`site.js` ou
`admin.js`). `catalog.js` expose `ORIXA_PRODUCTS`, `ORIXA_CATEGORIES`,
`ORIXA_CURRENCIES`, `OrixaCurrency`, `OrixaFmt` ; `theme.js` expose `OrixaTheme` ;
`site.js` expose `OrixaProducts()`, `OrixaCategories()`, `OrixaCart`,
`OrixaFav`, `OrixaCard`, `OrixaStore`, `OrixaPaint` ; `admin.js` expose
`OrixaAdmin` (dont `formatPrice`, `CURRENCIES`, `settings`, sauvegarde JSON).

**Règle de persistance** : tout passe par `Store.get/set` (try/catch
localStorage + repli mémoire). Les clés : `orixa:products`, `orixa:categories`,
`orixa:theme`, `orixa:sections:v2`, `orixa:menu:v2`, `orixa:settings`,
`orixa:cart`, `orixa:favs`, `orixa:media`, `orixa:collections`,
`orixa:discounts`, `orixa:articles`, `orixa:pages`, `orixa:users`,
`orixa:orders`, `orixa:cookies`, `orixa:visitor-currency`, `orixa:admin-side`.

---

## 4. Le back-office (CMS complet)

| Écran | Fonctions |
|---|---|
| Tableau de bord | KPI, histogramme des ventes, répartition par rayon, stock faible *(CA/commandes/clients = données de démo statiques)* |
| Commandes | Recherche, filtre statut, export CSV *(démo)* |
| Clients | Liste *(démo)* |
| Produits | Créer / modifier / supprimer, photo depuis la médiathèque, prix, description, stock, rayon, actions en lot, export CSV |
| **Rayons** | **Créer des rayons → chacun a sa page publique auto-générée**, image de couverture, bouton « Page » |
| Collections | Regroupements de produits, slug, visibilité |
| Réductions | Codes promo (% / montant fixe / livraison offerte, minimum, limite, expiration) |
| Personnalisation | Constructeur de sections (9 types) + thème (couleurs, typographies, formes, bandeau, pied) avec aperçu live |
| Menus | Entrées et sous-entrées, réordonnancement, visibilité, aperçu |
| Médiathèque | 32 visuels du projet + téléversement |
| Articles | Journal avec éditeur de texte enrichi |
| Pages | Inventaire des pages ; `histoire`, `contact`, `legal` éditables en CMS |
| Utilisateurs | Comptes et 4 rôles avec permissions |
| Réglages | Boutique, livraison, paiements, **devise**, sauvegarde/restauration JSON, réinitialisation |

**Ce qui est réel** : catalogue, rayons, sections, thème, menus, médiathèque,
collections, réductions, articles, pages, utilisateurs, panier, favoris, tunnel,
devise, sélecteur client.
**Ce qui est démo statique** : CA, commandes, clients (signalé par bannière).
**Limite connue** : localStorage = modifications visibles uniquement sur
l'appareil ; suffisant pour concevoir/démontrer/valider.

---

## 5. Direction design EXIGÉE (critique — à respecter impérativement)

Le propriétaire vise un site de **qualité haut de gamme** (référence :
« site valorisé 200 000 € »), au niveau de direction artistique de marques
premium (références données : « Fable », « 21st.dev », « MCP magic »), en
utilisant les centaines de skills de design disponibles.

**Exigences :**
1. **Zéro « AI-slop »** : pas de dégradés flashy gratuits, pas de cartes
   « glossy » génériques, pas d'emojis, pas de micro-interactions tape-à-l'œil.
2. **Rétention humaine avant tout** : hiérarchie typographique forte, rythme,
   espaces, images traitées en pleine page, narration de marque.
3. **Luxe sobre et éditorial** : le système actuel (or `#C9A84C`, noir
   `#111110`, crème `#F6F3EC`, Playfair Display + Space Grotesk) est une bonne
   base ; il peut être affiné (respirations, grille, macro-typographie, header
   minimal, hero cinématique).
4. **Cohérence front/admin** : le back-office reste fonctionnel, sobre et
   distinct du front (sidebar sombre, fond crème) — sans effets superflus.
5. Les 3 explorations dans `design-demos/` (Noir & Or, Crème élégance,
   Éditorial contemporain) sont des **pistes non branchées** : elles peuvent
   servir de base à une refonte, ou être retravaillées.

> Le propriétaire n'est **pas encore satisfait** du niveau de design actuel :
> la refonte/élévation visuelle est la **priorité des prochaines itérations**
> (sans casser les fonctionnalités du CMS ni les corrections listées en §2).

---

## 6. Ce qui reste à brancher pour la production

| Emplacement | À faire |
|---|---|
| `assets/js/auth.js` | Connexion, inscription, réinitialisation réelles |
| `commande.html` | Passerelle Stripe / PayPal / Wero / virement |
| `admin.js` | Remplacer le localStorage par des appels API |
| `admin/reductions.html` | **Valider les codes côté serveur** (contournable en client) |
| `admin/utilisateurs.html` | **Appliquer les rôles côté serveur** |
| `admin/commandes.html` | Commandes réelles |
| `admin/medias.html` | Stockage serveur au lieu du data URL |
| `legal.html` | Faire relire par un juriste ; SIRET et hébergeur à renseigner |
| SEO | Rendu serveur ou pré-génération (l'accueil est rendu en JS) |

---

## 7. Commandes utiles

```bash
# Lancer le site (obligatoire : servir en HTTP, pas en file://)
cd orixa && python3 -m http.server 8000
# http://localhost:8000          → boutique
# http://localhost:8000/admin/   → back-office

# Vérifier la syntaxe JS
node --check assets/js/catalog.js assets/js/theme.js assets/js/site.js \
     assets/js/admin.js assets/js/editor.js assets/js/auth.js
```

Scanner des liens et tests headless : voir la section 2-H (à rejouer après
toute modification).

---

*Document généré pour la transmission du projet ORIXA (zip) à Claude.*
*Source de vérité du code : les fichiers du projet ; ce document décrit les
changements apportés à la version 0 et le contexte client corrigé.*
