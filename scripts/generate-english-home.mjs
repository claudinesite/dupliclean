import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import createContentRenderer from '../dist/cms-content.js';

const dist = new URL('../dist/', import.meta.url);
const {document} = parseHTML(await readFile(new URL('index.html', dist), 'utf8'));
const content = JSON.parse(await readFile(new URL('content/english.json', dist), 'utf8'));
const site = new URL('https://dupliclean.ca/en/');
document.documentElement.lang = 'en';
document.querySelector('meta[name="description"]').content = 'Find duplicate files, similar photos, large files and screenshots on Android, OneDrive, Dropbox and MEGA. You choose what to remove.';
createContentRenderer(document, site, false)(content);

const language = document.querySelector('.language-switch');
language.textContent = 'FR';
language.href = '/';
language.lang = 'fr';
language.setAttribute('hreflang', 'fr');
language.setAttribute('aria-label', 'Voir le site en français');
for (const [selector, label] of Object.entries({
  '.reference-brand': 'DupliClean home', '.reference-menu-button': 'Open menu',
  '#reference-menu': 'Main navigation', '.reference-charts': 'Illustrative scan results',
  '.stats-band': 'DupliClean at a glance', '.stats-toggle': 'Pause scrolling',
  '.benefit-nav': 'DupliClean features', '.footer-legal': 'Official information',
})) document.querySelector(selector).setAttribute('aria-label', label);
document.querySelector('.stats-toggle').title = 'Pause scrolling';
document.querySelector('.reference-bottom-copy > span').textContent = '*  / About /';
const categories = ['Exact duplicates', 'Similar photos', 'Large files', 'Screenshots'];
document.querySelectorAll('.scan-category b').forEach((node, i) => { node.textContent = categories[i]; });
document.querySelectorAll('.keep-row').forEach((row, i) => {
  const text = [...row.childNodes].find(node => node.nodeType === 3 && node.textContent.trim());
  text.textContent = i === 0 ? ' Keep this file. ' : ' Select this copy.';
});

// The retired demo has no public entry point. Its script depends on its dialogs.
document.querySelectorAll('dialog,script[src="app.js"]').forEach(node => node.remove());
for (const node of document.querySelectorAll('[src],link[rel="stylesheet"]')) {
  const attribute = node.hasAttribute('src') ? 'src' : 'href';
  const value = node.getAttribute(attribute);
  const url = new URL(value, site.origin);
  if (url.origin === site.origin) node.setAttribute(attribute, url.pathname);
}
for (const link of document.querySelectorAll('a[href]')) {
  if (link.getAttribute('href').startsWith('#')) continue;
  const url = new URL(link.getAttribute('href'), site);
  if (url.origin !== site.origin) continue;
  if (url.pathname === site.pathname && url.hash) link.setAttribute('href', url.hash);
  else if (/^\/[\w-]+\.html$/.test(url.pathname)) link.href = '/en' + url.pathname + url.hash;
  else link.href = url.pathname + url.search + url.hash;
}
await mkdir(new URL('en/', dist), {recursive: true});
await writeFile(new URL('en/index.html', dist), document.toString());
