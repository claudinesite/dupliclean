// Public, published website content only. No API token is sent to the browser.
const PROJECT_ID = '89363tcz';
const DATASET = 'production';
const API_VERSION = '2026-11-05';

async function queryPublished(query, params = {}) {
  const url = new URL(`https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error('Sanity query failed');
  return payload.result;
}

module.exports = { PROJECT_ID, DATASET, API_VERSION, queryPublished };
