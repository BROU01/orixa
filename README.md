# ORIXA — boutique en ligne + CMS

Cosmétiques naturels et produits exotiques. Maison française, livraison partout
en Europe. Statique (HTML/CSS/JS), sans build, sans dépendance npm.
22 pages, dont un back-office éditable.

---

## Lancer

**Servir en HTTP**, pas en double-clic :

```bash
cd orixa
python3 -m http.server 8000
```

<http://localhost:8000> pour la boutique, <http://localhost:8000/admin/> pour l'administration.

En `file://`, l'aperçu de l'éditeur de thème ne fonctionne pas (iframe bloquée par
la politique d'origine) et la persistance devient aléatoire.

---

## Le CMS

La page d'accueil n'est pas du HTML figé : elle est **composée de sections** que
l'on ajoute, réordonne, masque et supprime depuis `admin/personnalisation.html`,
avec aperçu en direct.

**9 types de sections** : bannière (vidéo ou image), grille de rayons, grille de
produits, points forts, texte libre, bandeau image+texte, questions fréquentes,
newsletter, galerie.

Chaque type déclare son schéma dans `assets/js/theme.js`. Les formulaires de
l'éditeur sont **générés depuis ce schéma** — ajouter un type le rend
automatiquement éditable, sans toucher à l'interface d'administration.

Types de champs pris en charge : texte, texte long, liste déroulante,
interrupteur, curseur, lien, image (via médiathèque), vidéo, sélecteur de
produits, sélecteur de rayon, et **listes répétables** (questions FAQ, points
forts, images de galerie) avec ajout/suppression/réordonnancement.

Certains champs sont **conditionnels** : choisir « image » plutôt que « vidéo »
dans la bannière remplace le champ correspondant.

### Le reste du back-office

| Écran | Ce qu'on peut faire |
|---|---|
| Tableau de bord | KPI, histogramme des ventes, répartition par rayon, stock faible |
| Commandes | Recherche, filtre par statut, export CSV *(données de démo)* |
| Clients | Liste *(données de démo)* |
| Produits | Créer, modifier, supprimer, image depuis la médiathèque, actions en lot (stock, rayon, suppression), export CSV |
| Collections | Créer des regroupements de produits, slug, visibilité |
| Réductions | Codes promo : pourcentage, montant fixe, livraison offerte, minimum, limite, expiration |
| Personnalisation | Constructeur de sections + thème (couleurs, typographie, formes, bandeau, pied) |
| Menus | Entrées et sous-entrées, réordonnancement, visibilité, aperçu |
| Médiathèque | 32 visuels du projet + téléversement d'images |
| Articles | Journal avec éditeur de texte enrichi (gras, italique, titres, listes, liens) |
| Pages | Inventaire des pages et leur mode de composition |
| Utilisateurs | Comptes et 4 rôles avec permissions décrites |
| Réglages | Boutique, livraison, paiements, **sauvegarde/restauration JSON**, réinitialisation |

---

## Ce qui est réel, ce qui ne l'est pas

**Réel et fonctionnel** : le catalogue (28 produits liés aux vrais visuels), le
constructeur de sections, le thème, les menus, la médiathèque, les collections,
les codes de réduction, les articles, les utilisateurs, le panier, les favoris,
le tunnel de commande, la sauvegarde/restauration.

**Données de démonstration statiques** : chiffre d'affaires, liste des commandes,
liste des clients, histogramme des ventes. Signalé par une bannière sur les écrans
concernés.

**La limite à connaître** : tout est écrit dans le `localStorage` du navigateur.
**Vos modifications ne sont visibles que par vous, sur cet appareil.** C'est
suffisant pour concevoir, démontrer et valider, pas pour exploiter une boutique.
Le bouton *Télécharger la sauvegarde* de la page Réglages exporte l'ensemble en
JSON — de quoi transmettre la configuration à un développeur back-end.

---

## Arborescence

```
orixa/
├── index.html            Accueil — composée de sections modifiables
├── boutique.html         Catalogue : filtres rayon/prix/stock + tri
├── produit.html          Fiche produit (?id=karite)
├── histoire.html         Notre histoire
├── contact.html          Contact, livraison, retours, FAQ
├── legal.html            Mentions, CGV, confidentialité, RGPD, cookies
├── favoris.html          Favoris client
├── commandes.html        Historique client
├── commande.html         Tunnel de commande (Stripe / PayPal / Wero / virement)
│
├── compte/
│   ├── index.html                Connexion — carte de verre sur fond photo
│   ├── inscription.html
│   └── mot-de-passe-oublie.html
│
├── admin/                13 écrans (voir tableau ci-dessus)
│
├── assets/
│   ├── css/site.css      Design system front
│   ├── css/auth.css      Pages d'authentification
│   ├── css/admin.css     Back-office + constructeur
│   ├── js/catalog.js     28 produits — source unique de vérité
│   ├── js/theme.js       MOTEUR CMS : schémas des sections, rendu, menus, thème
│   ├── js/site.js        Rendu front, panier, favoris, aperçu live
│   ├── js/editor.js      Constructeur de pages
│   ├── js/admin.js       État du back-office
│   ├── js/auth.js        Validation des formulaires
│   ├── img/              logo, favicon, poster vidéo, fond d'authentification
│   └── video/hero.mp4    Vidéo de la bannière d'accueil
│
└── products/             28 visuels (cosmetics/ + exotic/)
```

---

## Direction visuelle

- Or `#C9A84C` / or profond `#9A7A2E`, noir `#111110`, papier crème `#F6F3EC`.
- Playfair Display (titres) + Space Grotesk (texte), chargées depuis Google Fonts.
- **Signature** : la provenance. Chaque produit porte son origine réelle
  (Burkina Faso, Côte d'Ivoire, Maroc…), traitée en libellé typographique.

La page de connexion utilise le fond photo plein écran avec une carte translucide
centrée (`backdrop-filter: blur(22px)`). Le contraste mesuré du texte sur la carte
est de **16,8:1** — le voile sombre sous le verre garantit la lisibilité quelle que
soit la photo de fond. Un repli opaque est prévu si le navigateur ne gère pas
`backdrop-filter`, ainsi que si l'utilisateur demande une transparence réduite.

Le back-office est délibérément différent du front — sidebar noire, fond crème,
tableaux denses — pour qu'on ne confonde jamais les deux contextes.

---

## À brancher pour la production

| Emplacement | À faire |
|---|---|
| `assets/js/auth.js` | Connexion, inscription, réinitialisation |
| `commande.html` | Passerelle Stripe / PayPal / Wero / virement |
| `assets/js/admin.js` | Remplacer le `localStorage` par des appels API |
| `admin/reductions.html` | **Valider les codes côté serveur** — une remise vérifiée dans le navigateur est contournable |
| `admin/utilisateurs.html` | **Appliquer les rôles côté serveur** — masquer un écran ne protège rien |
| `admin/commandes.html` | Commandes réelles |
| `admin/medias.html` | Stockage serveur au lieu du data URL |
| `legal.html` | Faire relire par un juriste, renseigner SIRET et hébergeur |

---

## Notes techniques

- Fichiers produits renommés en slugs ASCII. L'original
  `Crayon #U00e0 sourcils blond.jpg` contenait un `#`, qui casse toute URL.
- Recherches insensibles aux accents : « karite » trouve « karité ».
- Accessibilité : skip links, focus visibles, labels réels, `aria-*` sur les
  contrôles à icône seule, `prefers-reduced-motion` et
  `prefers-reduced-transparency` respectés, cibles tactiles ≥ 44 px.
- L'accueil étant rendu en JavaScript, un repli `<noscript>` est prévu. Pour un
  référencement optimal, il faudra un rendu serveur ou une pré-génération.
- Responsive vérifié de 390 px à 1500 px.
