const query = require('../sanity/content-query.cjs');
const { queryPublished } = require('../sanity/client.cjs');

module.exports = async function content(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).json({ error: 'Méthode non autorisée.' });
  }
  try {
    const content = await queryPublished(query);
    if (!content?.hero || !content?.faq) throw new Error('Site content missing');
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=60');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    return response.status(200).json(content);
  } catch (error) {
    console.warn('[Sanity content]', error.message);
    response.setHeader('Cache-Control', 'no-store');
    return response.status(503).json({ error: 'Contenu temporairement indisponible.' });
  }
};
