(function () {
  const select = (selector, root = document) => root.querySelector(selector);
  const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];

  function setText(selector, value, root = document) {
    const element = select(selector, root);
    if (element && typeof value === 'string') element.textContent = value;
  }

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

  function applyFixedItems(selector, items, callback) {
    if (!Array.isArray(items)) return;
    const elements = selectAll(selector);
    items.slice(0, elements.length).forEach((item, index) => callback(elements[index], item));
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
      setText('.reference-hero-actions button', hero.secondaryButton);

      const about = select('.reference-bottom-copy p');
      if (about) {
        about.replaceChildren(
          document.createTextNode(`${hero.aboutLead} `),
          Object.assign(document.createElement('span'), { textContent: hero.aboutBody }),
        );
      }

      document.title = `DupliClean — ${hero.titleLead} ${hero.titleAccent} ${hero.titleEnd}`;
    }

    applyFixedItems('.reference-stats > div', stats, (element, item) => {
      setText('strong', item.value, element);
      setText('span', item.label, element);
    });

    if (benefits) {
      setSplitHeading('.poster-heading h2', benefits.titleLead, benefits.titleAccent);
      setSplitHeading('.benefit-overview-copy h3', benefits.resultsTitleLead, benefits.resultsTitleEnd);
      setText('.benefit-overview-copy > p', benefits.resultsDescription);
      applyFixedItems('.poster-grid article', benefits.items, (element, item) => {
        setText('h3', item.title, element);
        const paragraphs = selectAll('.benefit-article-content > p', element);
        if (paragraphs[0]) paragraphs[0].textContent = item.summary;
        if (paragraphs[1]) paragraphs[1].textContent = item.explanation;
      });
      setText('.poster-choice h3', benefits.choiceTitle);
      setText('.poster-choice p', benefits.choiceDescription);
    }

    if (steps) {
      setText('.how .section-kicker', steps.kicker);
      setSplitHeading('.how .section-heading h2', steps.titleLead, steps.titleAccent);
      setText('.how .section-heading > p', steps.intro);
      applyFixedItems('.steps > article', steps.items, (element, item) => {
        setText('.step-title h3', item.title, element);
        const description = select(':scope > p', element);
        if (description) description.textContent = item.description;
      });
    }

    if (sources) {
      setText('.sources-copy .section-kicker', sources.kicker);
      setSplitHeading('.sources-copy h2', sources.titleLead, sources.titleAccent);
      const description = select('.sources-copy > p:not(.poster-more)');
      if (description) description.textContent = sources.description;
      applyFixedItems('.integration-list > div', sources.items, (element, item) => {
        setText('h3', item.title, element);
        setText('p', item.description, element);
      });
    }

    if (data) {
      setText('.data-heading .section-kicker', data.kicker);
      setSplitHeading('.data-heading h2', data.titleLead, data.titleAccent);
      setText('.data-heading > p', data.intro);
      applyFixedItems('.data-actions article', data.items, (element, item) => {
        setText('h3', item.title, element);
        setText('p', item.description, element);
      });
    }

    if (faq) {
      setText('.faq > div:first-child .section-kicker', faq.kicker);
      setSplitHeading('.faq > div:first-child h2', faq.titleLead, faq.titleAccent);

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
    }

    if (footer) setText('.site-footer > p', footer.tagline);
  }

  fetch('/content/site.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Contenu indisponible (${response.status})`);
      return response.json();
    })
    .then(applyContent)
    .catch((error) => console.warn('[DupliClean CMS]', error.message));
})();
