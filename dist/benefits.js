(() => {
  const section = document.querySelector('#avantages');
  if (!section) return;
  const nav = section.querySelector('.benefit-nav');
  let frame;
  function update() {
    frame = null;
    const articles = [...section.querySelectorAll('.poster-grid > article')];
    const line = innerHeight * .45;
    const active = articles.reduce((selected, article) => article.getBoundingClientRect().top <= line ? article : selected, articles[0]);
    nav.querySelectorAll('a').forEach(link => {
      if (link.hash === '#' + active?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { addEventListener('scroll', schedule, { passive: true }); schedule(); }
    else { removeEventListener('scroll', schedule); }
  });
  observer.observe(section);
  new MutationObserver(schedule).observe(nav, {childList: true});
  addEventListener('resize', schedule);
})();
