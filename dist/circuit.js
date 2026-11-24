(() => {
  const hero = document.querySelector('.reference-hero');
  const svg = hero?.querySelector('.circuit-lines');
  if (!svg) return;
  const toggle = document.createElement('button');
  toggle.className = 'circuit-toggle';
  toggle.type = 'button';
  hero.append(toggle);
  let userPaused = false;
  let visible = true;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const en = document.documentElement.lang === 'en';
  function update() {
    hero.classList.toggle('circuit-paused', userPaused || !visible || document.hidden || reducedMotion.matches);
    toggle.setAttribute('aria-label', en ? (userPaused ? 'Resume circuit animation' : 'Pause circuit animation') :
      (userPaused ? 'Reprendre l’animation du circuit' : 'Mettre l’animation du circuit en pause'));
    toggle.innerHTML = userPaused
      ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 2 7 4-7 4z"/></svg><span>Circuit en pause</span>'
      : '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zm4 0h2v8H7z"/></svg><span>Circuit animé</span>';
    if (en) toggle.querySelector('span').textContent = userPaused ? 'Circuit paused' : 'Circuit animation';
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; update(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  update();
})();
