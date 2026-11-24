import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import legalContent from '../sanity/legal-content.cjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pages = Object.entries(legalContent.LEGAL_PAGES);

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(value, linkEmails = true) {
  const token = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|(?<![\w.%+@-])([\w%+-]+(?:\.[\w%+-]+)*@(?:[a-z\d-]+\.)+[a-z]{2,})(?![\w@-])/gi;
  let output = '';
  let cursor = 0;
  for (const match of value.matchAll(token)) {
    const [raw, code, label, url, bold, italic, email] = match;
    output += escapeHtml(value.slice(cursor, match.index));
    if (code) output += `<code>${escapeHtml(code)}</code>`;
    else if (label) {
      const safe = /^(https?:\/\/|mailto:|#|\/(?![\/\\]))/i.test(url) && !/[\s\\]/.test(url);
      const content = inline(label, false);
      output += safe ? `<a href="${escapeHtml(url)}">${content}</a>` : content;
    } else if (bold) output += `<strong>${inline(bold, linkEmails)}</strong>`;
    else if (italic) output += `<em>${inline(italic, linkEmails)}</em>`;
    else if (email && linkEmails) {
      const href = `mailto:${encodeURIComponent(email).replace('%40', '@')}`;
      output += `<a href="${href}">${escapeHtml(email)}</a>`;
    } else output += escapeHtml(raw);
    cursor = match.index + raw.length;
  }
  return output + escapeHtml(value.slice(cursor));
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

export function documentTemplate(name, title, markdown, lang = 'fr') {
  const en = lang === 'en';
  const home = en ? '/en/' : '/';
  const alternate = en ? 'fr' : 'en';
  const body = markdown.replace(/^# .+\r?\n/, '').replace(/^- \[(Français|English)\].+\r?\n/gm, '').replace(/^\s*---/, '');
  let language = 'fr';
  const toc = [];
  const englishStart = body.search(/^# English\s*$/m);
  if (en && englishStart < 0) throw new Error(`Missing English legal text in ${name}`);
  const content = markdownToHtml(en ? body.slice(englishStart) : body).replace(/<h([123]) id="([^"]+)">(.*?)<\/h\1>/g, (_, level, id, label) => {
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
    'third-party-licenses': ['Licences tierces.', 'Third-party licenses.'],
  };
  const englishTitles = {
    'privacy-policy': ['Your privacy.', 'In plain English.', 'Privacy policy'],
    'terms-of-use': ['Using DupliClean.', 'The terms explained.', 'Terms of use'],
    'data-deletion': ['Your data.', 'Your decisions.', 'Data management and deletion'],
    'third-party-licenses': ['Third-party software.', 'Licenses and notices.', 'Third-party licenses'],
  };
  const [headline, accent] = (en ? englishTitles : titles)[name];
  if (en) title = englishTitles[name][2];
  const nav = pages.map(([id, page], index) => `<a href="${home}${id}.html" ${id === name ? 'aria-current="page"' : ''}><span>0${index + 1}</span>${en ? englishTitles[id][2] : page.title}<span aria-hidden="true">↗</span></a>`).join('');
  const date = (en ? /Last updated:\s*([^*\r\n]+)/i : /Dernière mise à jour : ([^*\r\n]+)/).exec(markdown)?.[1] || '';
  function contents(language) {
    const label = language === 'en' ? 'Contents · English' : 'Sommaire · Français';
    const links = toc.filter(entry => entry.language === language).map(entry =>
      `<a href="#${entry.anchor}">${entry.label}</a>`).join('');
    return `<details${language === lang ? ' open' : ''}><summary>${label}</summary><nav aria-label="${label}">${links}</nav></details>`;
  }
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#F8F2EA">
  <title>${title} — DupliClean</title>
  <link rel="stylesheet" href="/typography.css">
  <link rel="stylesheet" href="/grain.css">
  <link rel="stylesheet" href="/footer-orbit.css">
  <link rel="stylesheet" href="/legal.css">
  <link rel="stylesheet" href="/language.css">
  <link rel="alternate" hreflang="en" href="https://dupliclean.ca/en/${name}.html">
  <link rel="alternate" hreflang="fr" href="https://dupliclean.ca/${name}.html">
</head>
<body id="top">
  <a class="skip" href="#document">${en ? 'Skip to document' : 'Aller au document'}</a>
  <header class="legal-header frame"><a class="legal-brand" href="${home}" aria-label="${en ? 'DupliClean home' : 'DupliClean, accueil'}"><span class="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m22 3-8 14m-3-2 7 4-3 10-12-7 8-7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m7 22 3-4m1 7 3-5M25 17v6m-3-3h6" stroke="currentColor" stroke-width="1.5"/></svg></span>Dupli<span>Clean.</span></a><div class="header-tools"><a class="language-switch" href="${en ? '/' : '/en/'}${name}.html" lang="${alternate}" hreflang="${alternate}" aria-label="${en ? 'Lire en français' : 'Read in English'}">${alternate.toUpperCase()}</a><a class="back" href="${home}">${en ? 'Back to the site' : 'Retour au site'} <span aria-hidden="true">↗</span></a></div></header>
  <main class="frame">
    <section class="legal-hero" aria-labelledby="page-title">
      <p class="eyebrow"><span aria-hidden="true">✳︎</span> DUPLICLEAN / ${en ? 'OFFICIAL INFORMATION' : 'INFORMATIONS OFFICIELLES'}</p>
      <h1 id="page-title">${headline}<br><span>${accent}</span></h1>
      <div class="hero-meta"><p>${title}</p>${date ? `<span>${en ? 'Updated' : 'Mis à jour le'} ${escapeHtml(date)}</span>` : ''}</div>
      <div class="orbit" aria-hidden="true"></div>
    </section>
    <nav class="document-nav" aria-label="${en ? 'Official documents' : 'Documents officiels'}">${nav}</nav>
    <div class="reading-layout">
      <aside class="contents"><div class="contents-inner"><p class="eyebrow">${en ? 'IN THIS DOCUMENT' : 'DANS CE DOCUMENT'}</p>${en ? '' : '<nav class="languages" aria-label="Langues"><a href="#français">Français ↓</a><a href="#english">English ↓</a></nav>'}${(en ? ['en'] : ['fr', 'en']).map(language => contents(language)).join('')}<a class="to-top" href="#top">${en ? 'Back to top ↑' : 'Retour en haut ↑'}</a></div></aside>
      <article id="document" class="legal-prose" aria-label="${title}">${en ? content.replace(/href="(?:https:\/\/dupliclean\.ca)?\/([\w-]+\.html)(?=[#"?])/g, 'href="/en/$1') : content}</article>
    </div>
    <section class="legal-outro download" id="telecharger"><p class="eyebrow"><span aria-hidden="true">✳︎</span> ${en ? 'FIND. REMOVE. BREATHE.' : 'TROUVEZ. SUPPRIMEZ. RESPIREZ.'}</p><h2>${en ? 'A lighter device,' : 'Un appareil plus léger,'}<br><span>${en ? 'a smoother day.' : 'un quotidien plus fluide.'}</span></h2><p class="outro-description">${en ? 'Make room for what matters.' : 'Libérez votre espace simplement.'}</p><a href="${home}#telecharger" class="outro-link"><span class="play-symbol" aria-hidden="true">▷</span><span><small>${en ? 'Get it on' : 'Disponible sur'}</small>Google Play</span><span aria-hidden="true">↗</span></a><p class="outro-availability">${en ? 'Available exclusively for Android on Google Play.' : 'Disponible uniquement sur Android, via Google Play.'}</p><p class="outro-languages">${en ? 'French · English · Italian · Spanish · German · Portuguese' : 'Français · English · Italiano · Español · Deutsch · Português'}</p></section>
  </main>
  <footer class="legal-footer frame"><a class="legal-brand" href="${home}">Dupli<span>Clean.</span></a><span>© ${new Date().getFullYear()} DupliClean</span><a href="#top">${en ? 'Back to top ↑' : 'Retour en haut ↑'}</a></footer>
<script src="/footer-orbit.js"></script>
</body>
</html>`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await mkdir(path.join(root, 'dist/en'), {recursive: true});
  for (const [name, {title}] of pages) {
    const markdown = await readFile(path.join(root, 'legal', `${name}.md`), 'utf8');
    await writeFile(path.join(root, 'dist/en', `${name}.html`), documentTemplate(name, title, markdown, 'en'), 'utf8');
    await writeFile(path.join(root, 'dist', `${name}.html`), documentTemplate(name, title, markdown), 'utf8');
  }
  console.log(`Generated ${pages.length} DupliClean legal pages.`);
}
