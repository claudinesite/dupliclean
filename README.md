# DupliClean

Landing page statique en HTML, CSS personnalisé, Tailwind CSS et JavaScript natif. Le contenu éditorial est géré avec Decap CMS et reste stocké dans le dépôt GitHub.

## Développement

```sh
npm ci
npm run build
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Ouvrir `http://127.0.0.1:4173`. Pendant les modifications des classes HTML :

```sh
npm run watch:css
```

## Administration Decap CMS

L’interface d’administration est disponible sur `https://dupliclean.vercel.app/admin/`.

- La structure des champs se trouve dans `dist/admin/config.yml`.
- Les textes modifiables se trouvent dans `dist/content/site.json`.
- `dist/cms-content.js` applique le contenu au site sans modifier le design.
- Chaque publication depuis Decap crée un commit sur `main`. L’intégration GitHub de Vercel redéploie ensuite automatiquement le site.

### Authentification GitHub

Créer une application OAuth GitHub avec :

- Homepage URL : `https://dupliclean.vercel.app/admin/`
- Authorization callback URL : `https://dupliclean.vercel.app/api/complete`

Ajouter ensuite ces variables à tous les environnements du projet Vercel :

```env
ORIGIN=https://dupliclean.vercel.app
COMPLETE_URL=https://dupliclean.vercel.app/api/complete
ADMIN_PANEL_URL=https://dupliclean.vercel.app/admin/
OAUTH_CLIENT_ID=...
OAUTH_CLIENT_SECRET=...
```

Les fonctions `api/begin.js` et `api/complete.js` effectuent le flux OAuth. Le secret GitHub reste uniquement dans Vercel et ne doit jamais être ajouté au dépôt.

## Fichiers principaux

- `dist/index.html` : page et classes utilitaires Tailwind.
- `src/tailwind.css` : imports, détection des sources et thème DupliClean.
- `dist/tailwind.css` : feuille générée par `npm run build`.
- `dist/style.css`, `dist/reference.css`, `dist/typography.css` : composition visuelle.
- `dist/app.js`, `dist/reference.js` : interactions.
- `dist/assets/` : images.
- `vercel.json` : configuration de build et des fonctions Vercel.

Le dossier `dist` reste directement hébergeable. Tailwind est compilé à la construction ; aucun script Tailwind/CDN n’est chargé sur la page publique.
