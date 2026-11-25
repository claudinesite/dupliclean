const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const {parseHTML} = require('linkedom');
const {resolveImages} = require('../sanity/images.cjs');

async function render(published, language = 'fr') {
  const {window, document} = parseHTML(readFileSync(language === 'en' ? 'dist/en/index.html' : 'dist/index.html', 'utf8'));
  const opened = [];
  const fetch = async url => url.startsWith('/api/content')
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

test('published section identifiers remain readable without authentication', () => {
  const sections = require('../studio/sections.json');
  const query = require('../sanity/content-query.cjs');
  for (const section of sections) {
    assert.ok(!section.id.includes('.'), 'Sanity treats dotted IDs as private');
    assert.ok(query.includes(`_id==${JSON.stringify(section.id)}`));
  }
});

test('section edits update the spirit text, images, links and buttons together', async () => {
  const {document} = await render({
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
  const button = document.querySelector('.store-button');
  assert.match(button.textContent, /Installer/);
  for (const link of [button, document.querySelector('.reference-nav-actions a:last-child')]) {
    assert.equal(link.href, 'https://play.google.com/store/apps/details?id=test');
    assert.equal(link.getAttribute('target'), '_blank');
  }
  assert.equal(document.querySelector('.footer-legal a:last-child').href, 'https://example.com/contact');
  const legends = document.querySelectorAll('.chart-legend');
  assert.match(legends[0].textContent, /2,4 Go/);
  assert.match(legends[1].textContent, /Vos fichiers/);
  assert.match(document.querySelector('.visual-source .tile').textContent, /Mon téléphone/);
});

test('Sanity additions extend the benefits navigation and details in both languages', async () => {
  for (const language of ['fr', 'en']) {
    const benefits = language === 'fr'
      ? require('../dist/content/benefits.json')
      : require('../dist/content/english.json').benefits;
    const initial = benefits.items.map((item, index) => ({...item, _key: 'item-' + (index + 1)}));
    const additions = [
      {_key: 'files', title: 'Gestion de fichiers', menuLabel: 'Fichiers', summary: 'Gérez vos fichiers.', explanation: 'Triez vos fichiers par catégorie.', image},
      {_key: 'videos', title: 'Gestion de vidéos', explanation: 'Retrouvez vos vidéos.'},
      {_key: 'photos', title: 'Gestion de photos', summary: 'Gérez vos photos.'},
    ];
    const {document} = await render({benefits: {items: [...initial, ...additions]}}, language);
    const links = [...document.querySelectorAll('.benefit-nav > a')];
    const details = [...document.querySelectorAll('.poster-grid > article')];
    assert.equal(links.length, 7);
    assert.equal(details.length, 7);
    assert.equal(details[0].id, 'avantage-detection');
    assert.ok(details[0].querySelector('.poster-icon svg'));
    for (const [index, link] of links.entries()) {
      const number = String(index + 1).padStart(2, '0');
      assert.equal(link.getAttribute('href'), '#' + details[index].id);
      assert.equal(link.querySelector('span').textContent, number);
      assert.equal(details[index].querySelector('.benefit-number').textContent, number);
      assert.equal(details[index].getAttribute('aria-labelledby'), details[index].querySelector('h3').id);
    }
    assert.equal(links[4].textContent, '05Fichiers');
    assert.equal(details[4].querySelector('h3').textContent, 'Gestion de fichiers');
    assert.equal(details[4].querySelector('p').textContent, 'Gérez vos fichiers.');
    assert.equal(details[4].querySelector('.benefit-explanation').textContent, 'Triez vos fichiers par catégorie.');
    assert.equal(details[4].querySelector('img').alt, image.alt);
    assert.equal(links[5].textContent, '06Gestion de vidéos');
    assert.ok(details[5].querySelector('p').hidden);
    assert.ok(details[6].querySelector('.benefit-explanation').hidden);

    const reordered = await render({benefits: {items: [initial[3], additions[0], initial[0]]}}, language);
    assert.deepEqual([...reordered.document.querySelectorAll('.poster-grid > article')].map(article => article.id),
      ['avantage-vos-donnees', 'avantage-element-files', 'avantage-detection']);
  }
});

test('unavailable CMS keeps current texts and visual assets without optional image gaps', async () => {
  const {document} = await render(null);
  assert.match(document.querySelector('.reference-about h2').textContent, /garder l’essentiel/);
  assert.equal(document.querySelector('.reference-hand').getAttribute('src'), 'https://dupliclean.ca/assets/dupliclean-phone-dashboard-fr.png');
  const english = parseHTML(readFileSync('dist/en/index.html', 'utf8')).document;
  assert.equal(english.querySelector('.reference-hand').getAttribute('src'), '/assets/dupliclean-phone-dashboard.png');
  assert.equal(document.querySelectorAll('.cms-section-media').length, 0);
  assert.equal(document.querySelectorAll('.stats-list:not([aria-hidden]) > div').length, 3);
  for (const link of document.querySelectorAll('[data-google-play]')) {
    assert.equal(new URL(link.href).searchParams.get('id'), 'com.dupliclean.app');
  }
});

test('the scrolling copy follows Sanity edits without a pause control', async () => {
  const {document} = await render({stats: {items: [{value: 'Sources à explorer', label: 'Sur votre téléphone', image}]}});
  const lists = document.querySelectorAll('.stats-list');
  assert.equal(lists.length, 2);
  assert.equal(lists[1].getAttribute('aria-hidden'), 'true');
  assert.equal(lists[0].innerHTML, lists[1].innerHTML);
  assert.equal(lists[1].querySelector('strong').textContent, 'Sources à explorer');
  assert.ok(document.querySelector('.stats-band').classList.contains('is-ready'));
  assert.equal(document.querySelector('.stats-band button'), null);
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
