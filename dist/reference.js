const menuButton=document.querySelector('.reference-menu-button');
const menu=document.querySelector('#reference-menu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu');}
menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-brand-group'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
const demo=document.querySelector('#demo-dialog');
document.querySelector('#open-demo').addEventListener('click',()=>demo.showModal());
document.querySelector('.demo-close').addEventListener('click',()=>demo.close());
demo.addEventListener('click',e=>{if(e.target===demo){const r=demo.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)demo.close();}});
