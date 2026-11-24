const menuButton=document.querySelector('.reference-menu-button');
const menu=document.querySelector('#reference-menu');
const menuEnglish = document.documentElement.lang === 'en';
const openLabel = menuEnglish ? 'Open menu' : 'Ouvrir le menu';
const closeLabel = menuEnglish ? 'Close menu' : 'Fermer le menu';
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',openLabel);}
menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?closeLabel:openLabel);});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-brand-group'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
import('./cms-content.js').catch(error=>console.warn('[DupliClean CMS]',error.message));
