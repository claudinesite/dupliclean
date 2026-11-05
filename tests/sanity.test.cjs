const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { queryPublished } = require('../sanity/client.cjs');
const { LEGAL_PAGES, portableToMarkdown } = require('../sanity/legal-content.cjs');
const contentHandler = require('../api/content.js');
const legalHandler = require('../api/legal.js');
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

function response() {
  return {
    headers: {}, statusCode: 200, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    send(body) { this.body = body; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('reads only published content, with parameterized queries and no secret', async () => {
  global.fetch = async (url, options) => {
    assert.equal(url.hostname, '89363tcz.apicdn.sanity.io');
    assert.equal(url.searchParams.get('perspective'), 'published');
    assert.equal(url.searchParams.get('$id'), '"privacyPolicy"');
    assert.equal(options.headers, undefined);
    assert.ok(options.signal);
    return { ok: true, json: async () => ({ result: { title: 'Public' } }) };
  };
  assert.deepEqual(await queryPublished('*[_id == $id][0]{title}', { id: 'privacyPolicy' }), { title: 'Public' });
});

test('site API serves current content with bounded caching', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ result: { hero: { subtitle: 'Test' }, faq: { items: [] } } }) });
  const res = response();
  await contentHandler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.hero.subtitle, 'Test');
  assert.match(res.headers['Cache-Control'], /s-maxage=30/);
});

test('Sanity failure permits frontend fallback and rejects writes', async () => {
  global.fetch = async () => { throw new Error('offline'); };
  const res = response();
  await contentHandler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  const write = response();
  await contentHandler({ method: 'POST' }, write);
  assert.equal(write.statusCode, 405);
});

test('import preserves every FR/EN legal paragraph and bullet', async () => {
  const imported = JSON.parse(readFileSync('sanity/initial-legal-content.json', 'utf8'));
  const normalize = (text) => text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  for (const [slug, page] of Object.entries(LEGAL_PAGES)) {
    const doc = imported.find((entry) => entry.type === page.id).content;
    const source = readFileSync(`legal/${slug}.md`, 'utf8').replaceAll('\r\n', '\n');
    const fr = source.split('# Français\n')[1].split('# English\n')[0];
    const en = source.split('# English\n')[1];
    for (const [markdown, blocks] of [[fr, doc.bodyFr], [en, doc.bodyEn]]) {
      const expected = normalize(markdown.replace(/^---\s*$/gm, ''));
      assert.equal(normalize(portableToMarkdown(blocks)), expected, slug);
    }
    global.fetch = async () => ({ ok: true, json: async () => ({ result: doc }) });
    const res = response();
    await legalHandler({ method: 'GET', query: { page: slug } }, res);
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.includes('id="français"'));
    assert.ok(res.body.includes('id="english"'));
    assert.ok(res.body.includes('legal.css'));
    const ids = [...res.body.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test('legal routes reject unknown paths and retain static documents offline', async () => {
  const unknown = response();
  await legalHandler({ method: 'GET', query: { page: '../../package' } }, unknown);
  assert.equal(unknown.statusCode, 404);
  global.fetch = async () => { throw new Error('offline'); };
  const res = response();
  await legalHandler({ method: 'GET', query: { page: 'privacy-policy' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, readFileSync('dist/privacy-policy.html', 'utf8'));
});

test('authored markup cannot inject executable HTML or javascript URLs', async () => {
  const { documentTemplate } = await import('../scripts/generate-legal-pages.mjs');
  const html = documentTemplate('privacy-policy', 'Confidentialité', '# Document\n\n# Français\n\n<script>alert(1)</script>\n\n[Test](javascript:alert)\n\n# English\n\nText');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes('<script>alert(1)</script>'));
});
