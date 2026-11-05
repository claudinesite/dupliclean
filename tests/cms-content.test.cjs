const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const {parseHTML} = require('linkedom');
const {resolveImages} = require('../sanity/images.cjs');

async function render(published) {
  const {window, document} = parseHTML(readFileSync('dist/index.html', 'utf8'));
  const opened = [];
  const fetch = async url => url === '/api/content'
    ? {ok: Boolean(published), status: published ? 200 : 503, json: async () => published}
    : {ok: true, json: async () => JSON.parse(readFileSync(`dist${url}`, 'utf8'))};
  vm.runInNewContext(readFileSync('dist/cms-content.js', 'utf8'), {
    document, window: {open: (...args) => opened.push(args)},
    location: {origin: 'https://dupliclean.ca'}, URL, AbortSignal, fetch,
    console: {warn() {}},
  });
  await new Promise(resolve => setImmediate(resolve));
  return {window, document, opened};
}
const image = {url: 'https://cdn.sanity.io/images/89363tcz/production/test-100x100.png', alt: 'Image modifiée', caption: 'Ma légende'};

test('section edits update the spirit text, images, links and buttons together', async () => {
  const {document, window, opened} = await render({
    stats: {presentationLead: 'DupliClean simplifie le tri.', presentationEnd: 'Gardez vos souvenirs.', kicker: 'L’ESPRIT DUPLICLEAN'},
    hero: {mainImage: image, primaryLink: '#sources'},
    benefits: {mainImage: image, resultsButtonLabel: 'Les étapes', items: [{title: 'Ma fonction', menuLabel: 'Mon menu', image}]},
    steps: {items: [{title: 'Ma première étape', image}]},
    sources: {items: [{title: 'Mon téléphone', tag: 'LOCAL', image}]},
    faq: {mainImage: image, items: [{question: 'Ma question ?', answer: 'Ma réponse.'}]},
    download: {buttonLabel: 'Installer', playStoreUrl: 'https://play.google.com/store/apps/details?id=test'},
    footer: {developerLabel: 'Notre développeur', developerUrl: 'https://example.com/contact'},
  });
  assert.match(document.querySelector('.reference-about h2').textContent.replace(/\s+/g, ' '), /DupliClean simplifie le tri\. Gardez vos souvenirs\./);
  assert.ok(document.querySelector('.reference-about .about-symbols'));
  assert.equal(document.querySelector('.reference-hand').getAttribute('src'), image.url);
  assert.equal(document.querySelector('.reference-hand').alt, image.alt);
  assert.equal(document.querySelector('.reference-hero-actions a').href, 'https://dupliclean.ca/#sources');
  assert.match(document.querySelector('.benefit-nav a').textContent, /Mon menu/);
  assert.equal(document.querySelector('.benefit-demo-caption').textContent, image.caption);
  assert.ok(document.querySelector('.step-visual').classList.contains('cms-custom-visual'));
  assert.equal(document.querySelector('.step-visual img').alt, image.alt);
  assert.equal(document.querySelectorAll('.faq-list details').length, 1);
  assert.equal(document.querySelector('.faq figcaption').textContent, image.caption);
  const button = document.querySelector('[data-store]');
  assert.match(button.textContent, /Installer/);
  button.dispatchEvent(new window.Event('click', {bubbles: true, cancelable: true}));
  assert.equal(opened[0][0], 'https://play.google.com/store/apps/details?id=test');
  assert.equal(document.querySelector('.footer-legal a:last-child').href, 'https://example.com/contact');
  const legends = document.querySelectorAll('.chart-legend');
  assert.match(legends[0].textContent, /2,4 Go/);
  assert.match(legends[1].textContent, /Vos fichiers/);
  assert.match(document.querySelector('.visual-source .tile').textContent, /Mon téléphone/);
});

test('unavailable CMS keeps current texts and visual assets without optional image gaps', async () => {
  const {document} = await render(null);
  assert.match(document.querySelector('.reference-about h2').textContent, /garder l’essentiel/);
  assert.equal(document.querySelector('.reference-hand').getAttribute('src'), 'https://dupliclean.ca/assets/dupliclean-phone-hand-transparent.png');
  assert.equal(document.querySelectorAll('.cms-section-media').length, 0);
  assert.equal(document.querySelectorAll('.reference-stats > div').length, 3);
});

test('links and images reject script URLs and untrusted image hosts', async () => {
  const {document} = await render({
    hero: {primaryLink: 'javascript:alert(1)', mainImage: {url: 'https://untrusted.example/test.png', alt: '<script>example</script>'}},
    faq: {items: [{question: '<img src=x onerror=alert(1)>', answer: '<script>alert(1)</script>'}]},
  });
  assert.notEqual(document.querySelector('.reference-hero-actions a').href, 'javascript:alert(1)');
  assert.ok(!document.querySelector('.reference-hand').src.includes('untrusted.example'));
  assert.equal(document.querySelectorAll('.faq-list script,.faq-list img').length, 0);
  assert.match(document.querySelector('.faq-list summary').textContent, /<img/);
});

test('Sanity image resolution includes optimized URLs and accepts empty optional fields', async () => {
  const result = await resolveImages({mainImage: {
    _type: 'image', asset: {_id: 'image-abc123-100x200-png'}, alt: 'Téléphone',
    crop: {left: 0, right: 0, top: 0, bottom: 0},
  }, optional: null});
  const url = new URL(result.mainImage.url);
  assert.equal(url.hostname, 'cdn.sanity.io');
  assert.equal(url.searchParams.get('w'), '1400');
  assert.equal(url.searchParams.get('auto'), 'format');
  assert.equal(result.optional, null);
});
