/* One-time entrances; content stays visible if scripts or motion are disabled. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const running = new Set();
  const seen = new WeakSet();
  const ease = 'cubic-bezier(.22,1,.36,1)';
  function play(element, frames, options = {}) {
    if (preference.matches || document.hidden) return;
    const animation = element.animate(frames, { duration: 650, easing: ease, fill: 'backwards', ...options });
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  }
  function illustrate(element, delay) {
    // Draw the poster's outline icons once, when their accompanying text enters.
    element.querySelectorAll('.poster-icon svg path, .poster-icon svg circle, .poster-icon svg rect').forEach((shape, index) => {
      const length = shape.getTotalLength();
      play(shape, [{ strokeDasharray: `${length} ${length}`, strokeDashoffset: length, opacity: .2 },
        { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0, opacity: 1 }],
      { duration: 950, delay: delay + index * 90 });
    });
    element.querySelectorAll('.tile').forEach((tile, index) => play(tile,
      [{ opacity: 0, translate: '0 28px', scale: '.88' }, { opacity: 1, translate: '0 0', scale: '1' }],
      { delay: delay + 140 + index * 130, duration: 800 }));
    const scan = element.querySelector('.scan-line');
    if (scan) {
      const distance = Math.max(0, scan.parentElement.clientWidth / 2 - 24);
      play(scan, [{ translate: `${-distance}px 0`, opacity: 0 }, { translate: `${-distance}px 0`, opacity: 1, offset: .15 },
        { translate: `${distance}px 0`, opacity: 1, offset: .85 }, { translate: `${distance}px 0`, opacity: 0 }],
      { delay: delay + 300, duration: 1500 });
    }
    const duplicate = element.querySelector('.mini-file.duplicate');
    if (duplicate) play(duplicate, [{ opacity: .35, translate: '0 12px' }, { opacity: 1, translate: '0 0' }],
      { delay: delay + 900 });
    element.querySelectorAll('.keep-row').forEach((row, index) => play(row,
      [{ translate: '18px 0', opacity: 0 }, { translate: '0 0', opacity: index ? .45 : 1 }],
      { delay: delay + 200 + index * 250 }));
    element.querySelectorAll('.chart-donut circle[stroke-dasharray]').forEach((arc, index) => play(arc,
      [{ strokeDashoffset: 220, opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }],
      { duration: 1100, delay: delay + index * 100 }));
  }
  function enter(element, delay = 0, fadeOnly = false) {
    if (seen.has(element)) return;
    seen.add(element);
    if (preference.matches || element.contains(document.activeElement)) return;
    const isHeading = element.matches('h1,h2');
    play(element, [
      { opacity: 0, translate: fadeOnly ? '0 0' : '0 20px', ...(isHeading ? { filter: 'blur(2px)' } : {}) },
      { opacity: 1, translate: '0 0', ...(isHeading ? { filter: 'blur(0px)' } : {}) }
    ], { duration: fadeOnly ? 850 : 700, delay });
    illustrate(element, delay);
  }
  const hero = [
    '.reference-hand', '.reference-eyebrow', '#hero-title',
    '.reference-subtitle', '.reference-hero-actions',
    '.reference-bottom-copy', '.reference-charts'
  ];
  hero.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) enter(element, index * 65, index === 0);
  });
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, index) => {
      enter(entry.target, Math.min(index, 3) * 70);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll([
    '.reference-about-label', '.reference-about h2', '.reference-stats > div',
    '.poster-heading > *', '.poster-grid > article', '.poster-choice', '.section-heading h2', '.section-heading > p', '.section-heading .section-kicker', '.steps > article', '.sources-copy > *', '.integration-list > div',
    '.data-heading > *', '.data-actions article', '.faq > div:first-child > *', '.faq-list > details', '.download > h2',
    '.download > p', '.download-buttons'
  ].join(',')).forEach(element => observer.observe(element));
  // Keyboard navigation must never land on an invisible animated control.
  document.addEventListener('focusin', event => {
    running.forEach(animation => {
      if (animation.effect.target.contains(event.target)) animation.cancel();
    });
  });
  preference.addEventListener('change', () => {
    if (preference.matches) running.forEach(animation => animation.cancel());
  });
  document.addEventListener('visibilitychange', () => {
    running.forEach(animation => document.hidden ? animation.pause() : animation.play());
  });
  // Rollups-style arrow reveal: keep the button dimensions and accessible name stable.
  document.querySelectorAll('.reference-cta, .reference-nav-actions a').forEach(button => {
    const label = document.createElement('span');
    label.className = 'motion-button-label';
    while (button.firstChild) label.append(button.firstChild);
    const arrow = document.createElement('span');
    arrow.className = 'motion-button-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    button.append(label, arrow);
    button.classList.add('motion-button');
  });
})();
