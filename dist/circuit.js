(() => {
  const hero = document.querySelector('.reference-hero');
  const svg = hero?.querySelector('.circuit-lines');
  const track = svg?.querySelector('path');
  if (!track) return;
  const ns = 'http://www.w3.org/2000/svg';
  const pulses = document.createElementNS(ns, 'g');
  pulses.setAttribute('class', 'circuit-pulses');
  // Each move starts a distinct existing circuit route, so pulses never jump between tracks.
  const routes = track.getAttribute('d').match(/M[^M]+/g);
  routes.forEach((route, index) => {
    const duration = [9, 12, 11, 14, 13, 10, 12.5][index % 7];
    for (const layer of ['halo', 'trail', 'core', 'tip']) {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', route);
      path.setAttribute('pathLength', '1000');
      path.setAttribute('class', `circuit-pulse circuit-pulse--${layer}`);
      path.style.setProperty('--circuit-duration', `${duration}s`);
      path.style.setProperty('--circuit-delay', `${-(index * 2.3 + 1)}s`);
      pulses.append(path);
    }
  });
  svg.append(pulses);
  const junctions = document.createElementNS(ns, 'g');
  junctions.setAttribute('class', 'circuit-junctions');
  [[148,370],[276,514],[276,646],[1052,514],[1182,370],[1052,646],[80,545],[1251,545]].forEach(([x,y], index) => {
    const node = document.createElementNS(ns, 'g');
    node.style.setProperty('--node-delay', (-index * 1.1) + 's');
    for (const [name, radius] of [['ring', 6], ['dot', 2]]) {
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', radius);
      circle.setAttribute('class', 'circuit-junction-' + name);
      node.append(circle);
    }
    junctions.append(node);
  });
  svg.append(junctions);
  const toggle = document.createElement('button');
  toggle.className = 'circuit-toggle';
  toggle.type = 'button';
  hero.append(toggle);
  let userPaused = false;
  let visible = true;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function update() {
    hero.classList.toggle('circuit-paused', userPaused || !visible || document.hidden || reducedMotion.matches);
    toggle.setAttribute('aria-label', userPaused ? 'Reprendre l’animation du circuit' : 'Mettre l’animation du circuit en pause');
    toggle.innerHTML = userPaused
      ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 2 7 4-7 4z"/></svg><span>Circuit en pause</span>'
      : '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zm4 0h2v8H7z"/></svg><span>Circuit animé</span>';
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; update(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  update();
})();
