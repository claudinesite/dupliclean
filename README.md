# DupliClean

Landing page en HTML, CSS personnalisé et Tailwind CSS compilé localement.
JavaScript natif pour le menu, la démonstration et les fenêtres de téléchargement.

## Développement

```sh
npm ci
npm run build
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Ouvrir http://127.0.0.1:4173. Pendant les modifications des classes HTML :

```sh
npm run watch:css
```

## Fichiers

- `dist/index.html` : page et classes utilitaires Tailwind.
- `src/tailwind.css` : imports, détection des sources et thème DupliClean.
- `dist/tailwind.css` : feuille générée par `npm run build`, à ne pas modifier manuellement.
- `dist/style.css`, `dist/reference.css`, `dist/typography.css` : détails visuels et typographiques personnalisés.
- `dist/app.js`, `dist/reference.js` : interactions.
- `dist/assets/` : images.

Le dossier `dist` reste directement hébergeable. Tailwind est compilé à la construction : aucun script Tailwind/CDN n’est nécessaire dans le navigateur. Le reset existant est conservé, sans Preflight, pour préserver la composition.
