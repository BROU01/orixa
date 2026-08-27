# Compatibilité iOS — ORIXA

## Corrections appliquées

Le viewport officiel Next.js est maintenant configuré avec `device-width`, une échelle initiale de 1 et `viewportFit: 'cover'`. Les pages qui utilisent des éléments fixes prennent en compte les safe areas iOS : header, menu mobile, tiroir panier, bandeau cookies, toast, en-tête d’authentification et pied de page.

Le header ne comprime plus ses actions sur les iPhone étroits. Le sélecteur de devise est masqué dans la barre supérieure sous 760 px et reste accessible dans le menu mobile. Les boutons principaux et les contrôles tactiles ont une zone minimale adaptée, avec `touch-action: manipulation` et sans délai visuel de tap.

Les champs mobiles utilisent au moins 16 px sous 620 px pour éviter le zoom automatique de Safari au focus. Le tiroir panier conserve un défilement inertiel sur iOS et ses actions restent accessibles au-dessus de la barre d’accueil. Le fond fixe des pages d’authentification est déjà remplacé par un fond défilant sur petit écran pour éviter les artefacts Safari.

## Vérifications

Les contrôles suivants ont été exécutés après correction : `npm run type-check`, `npm run build`, `npm run lint`, `npm audit --audit-level=high` et un smoke test HTML sur `/`, `/boutique`, `/cosmetiques`, `/produit?id=cos-ct-plus`, `/compte` et `/commande`. Toutes les routes ont répondu `200`, le viewport `cover` est présent et l’audit npm retourne zéro vulnérabilité.

Le lint termine avec zéro erreur et 43 avertissements non bloquants existants, principalement liés à l’usage de balises `<img>` et à des variables inutilisées.

## Limite de validation

La session ne fournit pas un appareil iPhone ou un simulateur Safari iOS réel. Les corrections ont donc été contrôlées par revue CSS/React, compilation, rendu HTML et règles responsive. Une dernière vérification manuelle sur Safari iOS réel reste recommandée pour les versions iOS ciblées, notamment le clavier, le paiement, le menu mobile, le tiroir panier et le bandeau cookies.
