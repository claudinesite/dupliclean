/* Large outlined sectors inspired by the Rollups reference, in DupliClean copper. */
(() => {
  const section = document.querySelector('#telecharger');
  if (!section) return;
  const point = (radius, angle) => {
    const rad = angle * Math.PI / 180;
    return `${(radius * Math.cos(rad)).toFixed(2)} ${(radius * Math.sin(rad)).toFixed(2)}`;
  };
  const panel = (inner, outer, start, end) => `M${point(inner,start)} L${point(outer,start)} A${outer} ${outer} 0 0 1 ${point(outer,end)} L${point(inner,end)} A${inner} ${inner} 0 0 0 ${point(inner,start)}Z`;
  const arcs = document.createElement('div');
  arcs.className = 'footer-orbit';
  arcs.setAttribute('aria-hidden','true');
  arcs.innerHTML = `<svg viewBox="-900 -900 1800 1800" xmlns="http://www.w3.org/2000/svg"><g class="footer-orbit-track"><circle r="790"/><circle r="490"/><circle r="420"/></g><g class="footer-orbit-rotor">${[[0,24],[25,31],[33,69],[72,113],[114,117],[120,157],[161,207],[208,214],[218,257],[260,297],[302,343],[346,359]].map(([a,b],i)=>`<path class="${i%3===0?'orbit-panel':''}" d="${panel(490,i%3===0?808:790,a,b)}"/>`).join('')}</g><g class="footer-orbit-rotor footer-orbit-rotor--inner">${[12,88,167,245,311].map(a=>`<path d="${panel(400,420,a,a+38)}"/>`).join('')}</g></svg>`;
  section.prepend(arcs);
  const button = document.createElement('button');
  button.className = 'footer-orbit-toggle';
  button.type = 'button';
  section.append(button);
  let paused = false;
  let visible = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function update() {
    section.classList.toggle('footer-orbit-paused', paused || !visible || document.hidden || reduced.matches);
    button.setAttribute('aria-label', paused ? 'Reprendre l’animation des arcs' : 'Mettre l’animation des arcs en pause');
    button.innerHTML = `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="${paused?'m3 2 7 4-7 4z':'M3 2h2v8H3zm4 0h2v8H7z'}"/></svg><span>${paused?'Animation en pause':'Animation'}</span>`;
  }
  button.addEventListener('click', () => { paused = !paused; update(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(section);
  reduced.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
})();
