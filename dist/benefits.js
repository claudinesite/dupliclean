(() => {
  const section = document.querySelector('#avantages');
  const links = [...section.querySelectorAll('.benefit-nav a')];
  const articles = [...section.querySelectorAll('.poster-grid article')];
  let frame;
  function update() {
    frame = null;
    const line = innerHeight * .45;
    const active = articles.reduce((selected, article) => article.getBoundingClientRect().top <= line ? article : selected, articles[0]);
    links.forEach(link => {
      if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { addEventListener('scroll', schedule, { passive: true }); schedule(); }
    else { removeEventListener('scroll', schedule); }
  });
  observer.observe(section);
  addEventListener('resize', schedule);
})();
