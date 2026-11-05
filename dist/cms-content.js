(function () {
  const select = (selector, root = document) => root.querySelector(selector);
  const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];

  function setText(selector, value, root = document) {
    const element = select(selector, root);
    if (element && typeof value === 'string') element.textContent = value;
  }

  function safeLink(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, location.origin);
      return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }

  function setLink(selector, value, root = document) {
    const link = select(selector, root);
    const href = safeLink(value);
    if (link && href) link.href = href;
  }

  function imageSource(value) {
    const href = safeLink(value?.url);
    if (!href) return null;
    const url = new URL(href);
    return url.origin === location.origin || url.hostname === 'cdn.sanity.io' ? href : null;
  }

  function applyImage(selector, value, root = document) {
    const img = select(selector, root);
    const src = imageSource(value);
    if (!img) return;
    if (src) img.src = src;
    if (typeof value?.alt === 'string') img.alt = value.alt;
  }

  function optionalMedia(root, value, beforeSelector, variant = '') {
    if (!root) return;
    let figure = select(':scope > .cms-section-media', root);
    const src = imageSource(value);
    if (!src) { figure?.remove(); return; }
    if (!figure) {
      figure = document.createElement('figure');
      figure.className = `cms-section-media ${variant}`;
      const img = document.createElement('img');
      img.loading = 'lazy';
      figure.append(img, document.createElement('figcaption'));
      root.insertBefore(figure, beforeSelector ? select(beforeSelector, root) : null);
    }
    applyImage('img', value, figure);
    const caption = select('figcaption', figure);
    caption.textContent = value.caption || '';
    caption.hidden = !value.caption;
  }

  function optionalVisual(root, value) {
    if (!root) return;
    let img = select(':scope > .cms-uploaded-image', root);
    const src = imageSource(value);
    root.classList.toggle('cms-custom-visual', Boolean(src));
    if (!src) { img?.remove(); return; }
    if (!img) {
      img = document.createElement('img');
      img.className = 'cms-uploaded-image';
      img.loading = 'lazy';
      root.append(img);
    }
    img.src = src;
    img.alt = value.alt || '';
  }

  // Capture lets the configured link override the older store click handler.
  const storeButton = select('[data-store="Google Play"]');
  storeButton?.addEventListener('click', (event) => {
    const url = safeLink(storeButton.dataset.storeUrl);
    if (!url) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }, true);

  function setSplitHeading(selector, lead, accent, root = document) {
    const heading = select(selector, root);
    if (!heading || !lead || !accent) return;

    heading.replaceChildren(
      document.createTextNode(lead),
      document.createElement('br'),
      Object.assign(document.createElement('span'), { textContent: accent }),
    );
  }

  function setHeroHeading(hero) {
    const heading = select('#hero-title');
    if (!heading) return;

    heading.replaceChildren(
      document.createTextNode(`${hero.titleLead} `),
      Object.assign(document.createElement('span'), { textContent: hero.titleAccent }),
      document.createElement('br'),
      document.createTextNode(hero.titleEnd),
    );
  }

  function applyFixedItems(selector, items, callback, root = document) {
    if (!Array.isArray(items)) return;
    const elements = selectAll(selector, root);
    items.slice(0, elements.length).forEach((item, index) => callback(elements[index], item));
  }

  function presentationNodes(value) {
    return value.split('\n').flatMap((line, index) => index ? [
      Object.assign(document.createElement('br'), { className: 'desktop-break' }),
      document.createTextNode(` ${line}`),
    ] : [document.createTextNode(line)]);
  }

  function setPresentation(stats) {
    if (!stats?.presentationLead || !stats?.presentationEnd) return;
    const heading = select('.reference-about h2');
    if (!heading) return;
    const symbols = select('.about-symbols', heading);
    const leading = stats.presentationLead;
    const content = [];
    // Reuse the decorative logo group rather than rebuilding its SVG markup.
    if (symbols && /^DupliClean\s/.test(leading)) {
      content.push(document.createTextNode('DupliClean '), symbols,
        ...presentationNodes(leading.slice('DupliClean'.length)));
    } else content.push(...presentationNodes(leading));
    const accent = document.createElement('span');
    accent.append(...presentationNodes(stats.presentationEnd));
    heading.replaceChildren(...content, document.createTextNode(' '), accent);
  }

  function applyContent(content) {
    const { hero, stats, benefits, steps, sources, data, faq, download, footer } = content;

    if (hero) {
      const eyebrow = select('.reference-eyebrow');
      const eyebrowIcon = eyebrow && select('.inline-broom', eyebrow);
      if (eyebrow && eyebrowIcon) {
        eyebrow.replaceChildren(
          document.createTextNode(`${hero.eyebrowLead} `),
          eyebrowIcon,
          document.createTextNode(` ${hero.eyebrowEnd}`),
        );
      }
      setHeroHeading(hero);
      setText('.reference-subtitle', hero.subtitle);
      setText('.reference-hero-actions a', hero.primaryButton);
      setText('.reference-hero-actions .secondary', hero.secondaryButton);
      setLink('.reference-hero-actions a', hero.primaryLink);
      setLink('.reference-hero-actions .secondary', hero.secondaryLink);
      setText('.reference-nav-actions a:first-child', hero.navDiscoverLabel);
      setText('.reference-nav-actions a:last-child', hero.navDownloadLabel);
      applyImage('.reference-hand', hero.mainImage);
      const menu = select('#reference-menu');
      if (menu && Array.isArray(hero.navigationLinks)) {
        menu.replaceChildren(...hero.navigationLinks.map(item => {
          const link = document.createElement('a');
          link.textContent = item.label;
          link.href = safeLink(item.link) || '#';
          link.addEventListener('click', () => {
            const toggle = select('.reference-menu-button');
            if (toggle?.getAttribute('aria-expanded') === 'true') toggle.click();
          });
          return link;
        }));
      }
      applyFixedItems('.reference-chart', hero.exampleCards, (element, item) => {
        const title = select('.chart-top > div', element);
        if (title) title.replaceChildren(document.createTextNode(item.title),
          Object.assign(document.createElement('small'), {textContent: item.subtitle}));
        setText('.chart-top > span', item.badge, element);
        setText(':scope > strong', item.value, element);
        const note = select('.chart-note', element);
        if (note) note.replaceChildren(Object.assign(document.createElement('span'), {textContent: item.noteBadge}),
          document.createTextNode(` ${item.note.trim()}`));
        setText('.chart-bottom > div > span', item.legendTitle, element);
        applyFixedItems('.chart-legend p', item.legend, (row, value) => {
          row.replaceChildren(document.createTextNode(`● ${value.label}`),
            Object.assign(document.createElement('b'), {textContent: value.value}));
        }, element);
      });

      const about = select('.reference-bottom-copy p');
      if (about) {
        about.replaceChildren(
          document.createTextNode(`${hero.aboutLead} `),
          Object.assign(document.createElement('span'), { textContent: hero.aboutBody }),
        );
      }

      document.title = `DupliClean — ${hero.titleLead} ${hero.titleAccent} ${hero.titleEnd}`;
    }

    setPresentation(stats);
    setText('.reference-about-label', stats?.kicker);
    optionalMedia(select('.reference-about'), stats?.mainImage, '.reference-stats');
    applyFixedItems('.reference-stats > div', stats?.items, (element, item) => {
      setText('strong', item.value, element);
      setText('span', item.label, element);
      optionalMedia(element, item.image, 'strong', 'cms-small-media');
    });

    if (benefits) {
      setSplitHeading('.poster-heading h2', benefits.titleLead, benefits.titleAccent);
      setSplitHeading('.benefit-overview-copy h3', benefits.resultsTitleLead, benefits.resultsTitleEnd);
      setText('.benefit-overview-copy > p', benefits.resultsDescription);
      setText('.poster-heading .section-kicker', benefits.kicker);
      setText('.benefit-nav-label', benefits.navLabel);
      setText('.benefit-overview-copy .section-kicker', benefits.resultsKicker);
      setText('.benefit-timeline-label', benefits.detailsLabel);
      const resultsButton = select('.benefit-overview-copy > a');
      if (resultsButton && benefits.resultsButtonLabel) {
        resultsButton.replaceChildren(document.createTextNode(`${benefits.resultsButtonLabel} `),
          Object.assign(document.createElement('span'), {textContent: '↗'}));
      }
      setLink('.benefit-overview-copy > a', benefits.resultsButtonLink);
      applyImage('.scan-screen-preview img', benefits.mainImage);
      setText('.benefit-demo-caption', benefits.mainImage?.caption);
      applyFixedItems('.poster-grid article', benefits.items, (element, item) => {
        setText('h3', item.title, element);
        const paragraphs = selectAll('.benefit-article-content > p', element);
        if (paragraphs[0]) paragraphs[0].textContent = item.summary;
        if (paragraphs[1]) paragraphs[1].textContent = item.explanation;
        optionalVisual(select('.poster-icon', element), item.image);
      });
      applyFixedItems('.benefit-nav a', benefits.items, (element, item) => {
        const number = select('span', element);
        const title = item.menuLabel || item.title;
        if (title && number) element.replaceChildren(number, document.createTextNode(title));
      });
      setText('.poster-choice h3', benefits.choiceTitle);
      setText('.poster-choice p', benefits.choiceDescription);
    }

    if (steps) {
      setText('.how .section-kicker', steps.kicker);
      setSplitHeading('.how .section-heading h2', steps.titleLead, steps.titleAccent);
      setText('.how .section-heading > p', steps.intro);
      optionalMedia(select('.how'), steps.mainImage, '.steps');
      applyFixedItems('.steps > article', steps.items, (element, item) => {
        setText('.step-title h3', item.title, element);
        const description = select(':scope > p', element);
        if (description) description.textContent = item.description;
        optionalVisual(select('.step-visual', element), item.image);
      });
    }

    if (sources) {
      setText('.sources-copy .section-kicker', sources.kicker);
      setSplitHeading('.sources-copy h2', sources.titleLead, sources.titleAccent);
      const description = select('.sources-copy > p:not(.poster-more)');
      if (description) description.textContent = sources.description;
      setText('.sources-copy .poster-more', sources.note);
      const types = select('.sources-copy .file-types');
      if (types && typeof sources.fileTypes === 'string') {
        types.replaceChildren(...sources.fileTypes.split(',').map((label, index) =>
          Object.assign(document.createElement('span'), {textContent: `${['▧', '▷', '▤'][index] || '·'} ${label.trim()}`}),
        ));
      }
      optionalMedia(select('.sources-copy'), sources.mainImage);
      applyFixedItems('.integration-list > div', sources.items, (element, item) => {
        setText('h3', item.title, element);
        setText('p', item.description, element);
        setText('.tag', item.tag, element);
        optionalVisual(select('.integration-symbol', element), item.image);
      });
      applyFixedItems('.visual-source .tile', sources.items, (element, item) => {
        setText('small', item.title, element);
        if (item.title) element.setAttribute('aria-label', item.title);
      });
    }

    if (data) {
      setText('.data-heading .section-kicker', data.kicker);
      setSplitHeading('.data-heading h2', data.titleLead, data.titleAccent);
      setText('.data-heading > p', data.intro);
      setText('.data-heading > a', data.buttonLabel ? `${data.buttonLabel} ↗` : undefined);
      setLink('.data-heading > a', data.buttonLink);
      optionalMedia(select('.data-heading'), data.mainImage, ':scope > a');
      applyFixedItems('.data-actions article', data.items, (element, item) => {
        setText('h3', item.title, element);
        setText('p', item.description, element);
        optionalVisual(select(':scope > span', element), item.image);
      });
    }

    if (faq) {
      setText('.faq > div:first-child .section-kicker', faq.kicker);
      setSplitHeading('.faq > div:first-child h2', faq.titleLead, faq.titleAccent);
      optionalMedia(select('.faq > div:first-child'), faq.mainImage);

      const list = select('.faq-list');
      if (list && Array.isArray(faq.items)) {
        list.replaceChildren(...faq.items.map((item, index) => {
          const details = document.createElement('details');
          if (index === 0) details.open = true;
          const summary = document.createElement('summary');
          summary.append(
            document.createTextNode(item.question),
            Object.assign(document.createElement('span'), { textContent: '+' }),
          );
          const answer = Object.assign(document.createElement('p'), { textContent: item.answer });
          details.append(summary, answer);
          return details;
        }));
      }
    }

    if (download) {
      setText('.download .section-kicker', download.kicker);
      setSplitHeading('.download h2', download.titleLead, download.titleAccent);
      setText('.download > p:not(.availability):not(.app-languages)', download.description);
      setText('.download .availability', download.availability);
      setText('.download .app-languages', download.languages);
      optionalMedia(select('.download'), download.mainImage, '.download-buttons');
      if (storeButton) {
        const label = select('span:nth-child(2)', storeButton);
        if (label && typeof download.buttonLabel === 'string') {
          label.replaceChildren(Object.assign(document.createElement('small'), {textContent: download.buttonEyebrow || ''}),
            document.createTextNode(download.buttonLabel));
        }
        const url = safeLink(download.playStoreUrl);
        if (url) storeButton.dataset.storeUrl = url;
      }
    }

    if (footer) {
      setText('.site-footer > p', footer.tagline);
      setText('.site-footer > span', footer.copyright);
      setText('.site-footer > a:last-of-type', footer.backToTopLabel);
      setText('.footer-legal a:nth-child(1)', footer.privacyLabel);
      setText('.footer-legal a:nth-child(2)', footer.termsLabel);
      setText('.footer-legal a:nth-child(3)', footer.deletionLabel);
      setText('.footer-legal a:nth-child(4)', footer.developerLabel);
      setLink('.footer-legal a:nth-child(4)', footer.developerUrl);
      optionalVisual(select('.site-footer .brand-icon'), footer.mainImage);
    }
  }

  const sections = ['hero', 'stats', 'benefits', 'steps', 'sources', 'data', 'faq', 'download', 'footer'];

  const fallbackContent = Promise.all(sections.map((section) =>
    fetch(`/content/${section}.json`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`${section}.json indisponible (${response.status})`);
        return response.json();
      })
      .then((value) => [section, value]),
  ))
    .then((entries) => Object.fromEntries(entries));

  // Keep a readable copy if Sanity is unavailable, and fill optional fields
  // from it while an editor is completing a document.
  function mergeContent(fallback, published) {
    if (fallback == null) return published ?? fallback;
    if (typeof fallback === 'string') return typeof published === 'string' ? published : fallback;
    if (Array.isArray(fallback)) {
      if (!Array.isArray(published) || !published.length) return fallback;
      return published.map((item, index) => mergeContent(fallback[index] || fallback[0], item));
    }
    return Object.fromEntries(Object.entries({...published, ...fallback}).map(([key, value]) =>
      [key, mergeContent(value, published?.[key])],
    ));
  }

  const publishedContent = fetch('/api/content', { signal: AbortSignal.timeout(6500) })
    .then((response) => {
      if (!response.ok) throw new Error(`Sanity indisponible (${response.status})`);
      return response.json();
    })
    .catch((error) => { console.warn('[DupliClean CMS]', error.message); return null; });

  fallbackContent.then(applyContent).catch((error) => console.warn('[DupliClean CMS]', error.message));
  Promise.all([fallbackContent, publishedContent])
    .then(([fallback, published]) => { if (published) applyContent(mergeContent(fallback, published)); })
    .catch((error) => console.warn('[DupliClean CMS]', error.message));
})();
