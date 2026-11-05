# DupliClean

Site HTML, CSS, Tailwind et JavaScript natif, hébergé sur Vercel. Le contenu est géré dans Sanity : projet DupliClean `89363tcz`, dataset public `production`. Descake reste indépendant.

## Modifier le site

1. Ouvrir https://dupliclean.ca/admin/ ou https://dupliclean-admin.sanity.studio/.
2. Se connecter avec le compte Sanity propriétaire du projet.
3. Ouvrir **Site DupliClean**, puis la fiche du même nom.
4. Choisir un onglet : Accueil, Chiffres clés, Avantages, Étapes, Sources, Données, FAQ, Téléchargement ou Pied de page.
5. Modifier puis cliquer sur **Publish**. Les brouillons restent privés.
6. Actualiser le site après une à deux minutes, le temps des caches Sanity et Vercel.

Les trois documents juridiques ont chacun leur fiche et deux onglets Français / English avec un éditeur de texte mis en forme. Les URL publiques restent identiques.

Utiliser les fiches existantes plutôt que créer des doublons : le site lit leurs identifiants fixes. Pour inviter un collaborateur plus tard, ouvrir les membres du projet DupliClean dans Sanity Manage.

## Fonctionnement

- `api/content.js` lit la fiche publiée `siteContent` avec la projection explicite de `sanity/content-query.cjs`.
- `dist/cms-content.js` applique ces textes au design existant.
- `api/legal.js` rend les documents juridiques publiés aux mêmes adresses `.html`, via les réécritures Vercel.
- `sanity/client.cjs` fixe le projet, le dataset, la version d’API et la perspective `published`. Aucun jeton n’est nécessaire au site.
- `dist/content/*.json`, les pages HTML générées et `legal/*.md` conservent la copie de secours.
- `scripts/generate-legal-pages.mjs` partage le rendu juridique entre le build et les fonctions.

Le Studio est **géré par le connecteur Sanity**, sans Studio local. Les schémas de référence sont `sanity/schema.json` et `sanity/legal-schema.json`. Pour les modifier, utiliser `deploy_schema` puis `deploy_studio` sur le workspace `default`.

Les fichiers `sanity/initial-*.json` sont les instantanés de migration, pris après récupération des dernières publications Decap. Ne pas les réimporter au-dessus des contenus édités depuis Sanity.

## Développement

```sh
npm ci
npm run build
node --test tests/sanity.test.cjs
vercel dev
```

`vercel dev` exécute les routes API et les réécritures. Un serveur statique simple affiche seulement le design et le contenu de secours.

Les changements de code passent par GitHub → Vercel. Publier un texte dans Sanity ne demande ni commit ni redéploiement.

Les anciens identifiants GitHub OAuth de Decap ne sont plus utilisés. Les anciens endpoints redirigent vers Sanity. Le propriétaire peut révoquer les secrets OAuth après validation de la migration.
