(() => {
  const hero = document.querySelector('.reference-hero');
  if (!hero?.querySelector('.circuit-lines')) return;
  let visible = true;
  function update() {
    hero.classList.toggle('circuit-paused', !visible || document.hidden);
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', update);
  update();
})();
