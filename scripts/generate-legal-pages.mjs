import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pages = [
  ['privacy-policy', 'Politique de confidentialité'],
  ['terms-of-use', 'Conditions d’utilisation'],
  ['data-deletion', 'Gestion et suppression des données'],
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function slug(value) {
  return value
    .trim()
    .toLocaleLowerCase('fr-CA')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

function markdownToHtml(markdown) {
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const rawLine of markdown.replaceAll('\r\n', '\n').split('\n')) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line === '---') {
      flushParagraph();
      flushList();
      blocks.push('<hr>');
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const text = heading[2];
      blocks.push(`<h${level} id="${slug(text)}">${inline(text)}</h${level}>`);
      continue;
    }

    const item = /^-\s+(.+)$/.exec(line);
    if (item) {
      flushParagraph();
      list.push(item[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks.join('\n');
}

function documentTemplate(name, title, markdown) {
  const body = markdown.replace(/^# .+\r?\n/, '').replace(/^- \[(Français|English)\].+\r?\n/gm, '').replace(/^\s*---/, '');
  let language = 'fr';
  const toc = [];
  const content = markdownToHtml(body).replace(/<h([123]) id="([^"]+)">(.*?)<\/h\1>/g, (_, level, id, label) => {
    if (label === 'English') language = 'en';
    const anchor = label === 'Français' ? 'français' : label === 'English' ? 'english' : `${language}-${id}`;
    if (level === '2') toc.push({ anchor, label, language });
    const tag = level === '1' ? 'h2' : level === '2' ? 'h3' : 'h4';
    return `<${tag} id="${anchor}"${level === '1' ? ' class="language-heading"' : ''}>${label}</${tag}>`;
  });
  const titles = {
    'privacy-policy': ['Votre vie privée.', 'En toute clarté.'],
    'terms-of-use': ['Les règles du jeu.', 'En toute simplicité.'],
    'data-deletion': ['Vos données.', 'Vos décisions.'],
  };
  const [headline, accent] = titles[name];
  const nav = pages.map(([id, label], index) => `<a href="/${id}.html" ${id === name ? 'aria-current="page"' : ''}><span>0${index + 1}</span>${label}<span aria-hidden="true">↗</span></a>`).join('');
  const date = /(?:Dernière mise à jour : )([^*\r\n]+)/.exec(markdown)?.[1] || '';
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#F8F2EA">
  <title>${title} — DupliClean</title>
  <link rel="stylesheet" href="/typography.css">
  <link rel="stylesheet" href="/grain.css">
  <link rel="stylesheet" href="/footer-orbit.css">
  <link rel="stylesheet" href="/legal.css">
</head>
<body id="top">
  <a class="skip" href="#document">Aller au document</a>
  <header class="legal-header frame"><a class="legal-brand" href="/" aria-label="DupliClean, accueil"><span class="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m22 3-8 14m-3-2 7 4-3 10-12-7 8-7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m7 22 3-4m1 7 3-5M25 17v6m-3-3h6" stroke="currentColor" stroke-width="1.5"/></svg></span>Dupli<span>Clean.</span></a><a class="back" href="/">Retour au site <span aria-hidden="true">↗</span></a></header>
  <main class="frame">
    <section class="legal-hero" aria-labelledby="page-title">
      <p class="eyebrow"><span aria-hidden="true">✳︎</span> DUPLICLEAN / INFORMATIONS OFFICIELLES</p>
      <h1 id="page-title">${headline}<br><span>${accent}</span></h1>
      <div class="hero-meta"><p>${title}</p><span>Mis à jour le ${date}</span></div>
      <div class="orbit" aria-hidden="true"></div>
    </section>
    <nav class="document-nav" aria-label="Documents officiels">${nav}</nav>
    <div class="reading-layout">
      <aside class="contents"><div class="contents-inner"><p class="eyebrow">DANS CE DOCUMENT</p><nav class="languages" aria-label="Langues"><a href="#français">Français ↓</a><a href="#english">English ↓</a></nav><details open><summary>Sommaire · Français</summary><nav aria-label="Sommaire français">${toc.filter(t => t.language === 'fr').map(t => `<a href="#${t.anchor}">${t.label}</a>`).join('')}</nav></details><details><summary>Contents · English</summary><nav aria-label="English contents">${toc.filter(t => t.language === 'en').map(t => `<a href="#${t.anchor}">${t.label}</a>`).join('')}</nav></details><a class="to-top" href="#top">Retour en haut ↑</a></div></aside>
      <article id="document" class="legal-prose" aria-label="${title}">${content}</article>
    </div>
    <section class="legal-outro download" id="telecharger"><p class="eyebrow"><span aria-hidden="true">✳︎</span> TROUVEZ. SUPPRIMEZ. RESPIREZ.</p><h2>Un appareil plus léger,<br><span>un quotidien plus fluide.</span></h2><p class="outro-description">Libérez votre espace simplement.</p><a href="/#telecharger" class="outro-link"><span class="play-symbol" aria-hidden="true">▷</span><span><small>Disponible sur</small>Google Play</span><span aria-hidden="true">↗</span></a><p class="outro-availability">Disponible uniquement sur Android, via Google Play.</p><p class="outro-languages">Français · English · Italiano · Español · Deutsch · Português</p></section>
  </main>
  <footer class="legal-footer frame"><a class="legal-brand" href="/">Dupli<span>Clean.</span></a><span>© ${new Date().getFullYear()} DupliClean</span><a href="#top">Retour en haut ↑</a></footer>
<script src="/footer-orbit.js"></script>
</body>
</html>`;
}

for (const [name, title] of pages) {
  const markdown = await readFile(path.join(root, 'legal', `${name}.md`), 'utf8');
  await writeFile(path.join(root, 'dist', `${name}.html`), documentTemplate(name, title, markdown), 'utf8');
}
console.log(`Generated ${pages.length} DupliClean legal pages.`);
