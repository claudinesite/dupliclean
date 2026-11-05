# DupliClean

Site HTML, CSS, Tailwind et JavaScript natif, hébergé sur Vercel. Le contenu est géré dans Sanity : projet DupliClean `89363tcz`, dataset public `production`. Descake reste indépendant.

## Modifier le site

1. Ouvrir https://dupliclean.ca/admin/ ou https://dupliclean-admin.sanity.studio/.
2. Se connecter avec le compte Sanity propriétaire du projet.
3. Choisir directement une rubrique dans le menu : le formulaire s’ouvre sans liste intermédiaire.
4. L’écran **Bien commencer** explique la publication et donne aussi accès aux rubriques.
5. Modifier puis cliquer sur **Publier**. Les brouillons restent privés.
6. Actualiser le site après une à deux minutes, le temps des caches Sanity et Vercel.

Les trois documents juridiques sont regroupés sous **Pages légales**, avec chacun deux onglets Français / English et un éditeur de texte mis en forme. Les URL publiques restent identiques.

Les rubriques sont des singletons : la création de doublons, la suppression et la dépublication sont désactivées dans le Studio. Pour inviter un collaborateur plus tard, ouvrir les membres du projet DupliClean dans Sanity Manage.

## Fonctionnement

- `api/content.js` lit neuf documents publiés `section.*` avec la projection explicite de `sanity/content-query.cjs`. La fiche originale `siteContent` est conservée comme archive et secours.
- `dist/cms-content.js` applique les textes, images et liens de chaque section au design existant. `dist/cms-editor.css` gère les visuels facultatifs.
- `sanity/images.cjs` construit les URL optimisées des images Sanity avec leurs recadrages. Les visuels de blocs utilisent une largeur de 256 px, les images principales 1 400 px.
- `api/legal.js` rend les documents juridiques publiés aux mêmes adresses `.html`, via les réécritures Vercel.
- `sanity/client.cjs` fixe le projet, le dataset, la version d’API et la perspective `published`. Aucun jeton n’est nécessaire au site.
- `dist/content/*.json`, les pages HTML générées et `legal/*.md` conservent la copie de secours.
- `scripts/generate-legal-pages.mjs` partage le rendu juridique entre le build et les fonctions.
- `scripts/generate-content-query.mjs` produit la projection depuis les champs du Studio pour garder les formulaires et l’API synchronisés.

Le Studio est désormais **géré par le code dans `studio/`**. Cette source remplace l’interface MCP générée pour permettre une navigation directe, les singletons et la traduction française. Le workspace actif est `dupliclean`; l’ancien workspace MCP `default` est conservé en archive. Ne pas réutiliser `deploy_studio` ou `deploy_schema` pour le Studio actif.

```sh
npm ci --prefix studio
npm run typecheck --prefix studio
npm run build --prefix studio
npm run deploy --prefix studio
```

Les schémas sont dans `studio/schemas.ts` et `studio/sections.json`; la navigation est dans `studio/structure.ts`. La commande de déploiement réutilise l’application Sanity `hjq0ue8c1eh4wfk4v3rxvtet` et l’hôte `dupliclean-admin`.

Chaque rubrique expose ses propres textes, visuels et liens. Le guide destiné à l’éditeur se trouve dans `sanity/GUIDE.md`. Les valeurs initiales des nouveaux champs sont dans `sanity/section-defaults.json`. Le script `studio/scripts/seed-section-media.ts` ajoute uniquement les valeurs absentes, importe les deux visuels actuels si nécessaire et préserve les éditions ainsi que les brouillons existants.

`studio/scripts/migrate-sections.ts` effectue une migration idempotente (simulation par défaut) depuis `siteContent`. Il conserve les données originales et copie les éventuels brouillons sans les publier.

Les fichiers `sanity/initial-*.json` sont les instantanés de migration, pris après récupération des dernières publications Decap. Ne pas les réimporter au-dessus des contenus édités depuis Sanity.

## Développement

```sh
npm ci
npm run build
npm test
vercel dev
```

`vercel dev` exécute les routes API et les réécritures. Un serveur statique simple affiche seulement le design et le contenu de secours.

Les changements de code passent par GitHub → Vercel. Publier un texte dans Sanity ne demande ni commit ni redéploiement.

Les anciens identifiants GitHub OAuth de Decap ne sont plus utilisés. Les anciens endpoints redirigent vers Sanity. Le propriétaire peut révoquer les secrets OAuth après validation de la migration.
