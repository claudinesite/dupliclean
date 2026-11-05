const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { queryPublished } = require('../sanity/client.cjs');
const { LEGAL_PAGES, portableToMarkdown } = require('../sanity/legal-content.cjs');

module.exports = async function legal(request, response) {
  const slug = request.query?.page;
  const page = Object.hasOwn(LEGAL_PAGES, slug) ? LEGAL_PAGES[slug] : null;
  if (!page) return response.status(404).send('Document introuvable.');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).send('Méthode non autorisée.');
  }

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const document = await queryPublished(
      '*[_id == $id][0]{bodyFr[]{_type,style,listItem,children[]{_type,text,marks}},bodyEn[]{_type,style,listItem,children[]{_type,text,marks}}}',
      { id: page.id },
    );
    if (!document?.bodyFr?.length || !document?.bodyEn?.length) throw new Error('Incomplete legal document');
    const markdown = `# ${page.title}\n\n# Français\n\n${portableToMarkdown(document.bodyFr)}\n\n# English\n\n${portableToMarkdown(document.bodyEn)}`;
    const { documentTemplate } = await import('../scripts/generate-legal-pages.mjs');
    response.setHeader('X-DupliClean-Content', 'sanity');
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=60');
    return response.status(200).send(documentTemplate(slug, page.title, markdown));
  } catch (error) {
    console.warn('[Sanity legal]', error.message);
    response.setHeader('X-DupliClean-Content', 'fallback');
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10');
    const html = await readFile(path.join(process.cwd(), 'dist', `${slug}.html`), 'utf8');
    return response.status(200).send(html);
  }
};
