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

function documentTemplate(title, content) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#F8F2EA">
  <meta name="robots" content="index, follow">
  <title>${title} — DupliClean</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
  <style>
    :root{--ink:#3B1D0F;--terrain:#8B4A28;--cream:#F8F2EA;--paper:#FFF6EB;--line:#E5D5C6;--olive:#66743D;--muted:#7C6A5D}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink);font-family:"DM Sans",system-ui,sans-serif;line-height:1.7}
    a{color:var(--terrain);text-underline-offset:.2em}.legal-header{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem clamp(1rem,4vw,3rem);background:rgba(248,242,234,.94);border-bottom:1px dashed var(--line);backdrop-filter:blur(14px)}
    .brand{font-weight:700;text-decoration:none;color:var(--ink);font-size:1.05rem}.brand span{color:var(--terrain)}.back{font-size:.9rem;font-weight:600;text-decoration:none}
    main{width:min(900px,calc(100% - 2rem));margin:clamp(2rem,7vw,5rem) auto;padding:clamp(1.25rem,5vw,4.5rem);background:var(--paper);border:1px dashed #cdbba9}
    h1,h2,h3{line-height:1.15;letter-spacing:-.035em}h1{font-size:clamp(2.2rem,6vw,4.8rem);margin:0 0 2rem}h2{font-size:clamp(1.55rem,3.2vw,2.25rem);margin:3.25rem 0 1rem;padding-top:1rem;border-top:1px dashed var(--line)}h3{font-size:1.2rem;margin:2rem 0 .7rem}
    p,li{font-size:clamp(.98rem,1.5vw,1.08rem)}ul{padding-left:1.25rem}li+li{margin-top:.35rem}hr{border:0;border-top:1px dashed var(--line);margin:2.5rem 0}strong{font-weight:700}
    main>p:first-of-type a{display:inline-block;margin-right:.5rem;padding:.4rem .75rem;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-weight:600}
    footer{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;width:min(900px,calc(100% - 2rem));margin:0 auto 3rem;color:var(--muted);font-size:.85rem}
    @media(max-width:600px){.legal-header{align-items:flex-start}main{width:100%;margin:0;border-inline:0;padding:1.25rem}h1{margin-top:1rem}}
  </style>
</head>
<body>
  <header class="legal-header"><a class="brand" href="/">Dupli<span>Clean</span>.</a><a class="back" href="/">← Retour au site</a></header>
  <main>${content}</main>
  <footer><span>© 2026 DupliClean</span><span>Document officiel de l’application</span></footer>
</body>
</html>`;
}

for (const [name, fallbackTitle] of pages) {
  const markdown = await readFile(path.join(root, 'legal', `${name}.md`), 'utf8');
  const firstHeading = /^#\s+(.+)$/m.exec(markdown)?.[1] || fallbackTitle;
  const html = documentTemplate(firstHeading, markdownToHtml(markdown));
  await writeFile(path.join(root, 'dist', `${name}.html`), html, 'utf8');
}

console.log(`Generated ${pages.length} DupliClean legal pages.`);
