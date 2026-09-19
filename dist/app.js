let currentSource = 'Téléphone';
let scanning = false;
const scanButton = document.querySelector('#scan-button');
const status = document.querySelector('#scan-status');
const sizes = { 'Téléphone': '3,2', 'OneDrive': '5,8', 'Google Drive': '2,4' };
document.querySelectorAll('.source-option').forEach(button => {
  button.addEventListener('click', () => {
    if (scanning) return;
    currentSource = button.dataset.source;
    document.querySelectorAll('.source-option').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#scan-size').innerHTML = `${sizes[currentSource]} <span>Go</span>`;
    document.querySelector('#summary-label').textContent = 'De la place pour de nouveaux souvenirs';
    document.querySelector('#scan-caption').textContent = 'd’espace à retrouver dans cet exemple';
    status.textContent = `Démonstration ${currentSource} · Aucun accès à vos fichiers`;
    scanButton.innerHTML = 'Lancer la démo d’analyse <span>↗</span>';
  });
});
scanButton.addEventListener('click', () => {
  if (scanning) return;
  scanning = true;
  scanButton.disabled = true;
  document.querySelectorAll('.source-option').forEach(item => item.disabled = true);
  scanButton.textContent = 'Analyse de l’exemple en cours…';
  status.textContent = 'Recherche des doublons dans les données de démonstration…';
  setTimeout(() => {
    document.querySelector('#summary-label').textContent = `Exemple d’analyse · ${currentSource}`;
    document.querySelector('#scan-caption').textContent = 'de doublons repérés dans cette démonstration';
    scanButton.innerHTML = 'Rejouer la démonstration <span>↻</span>';
    status.textContent = 'À vous de choisir ce que vous gardez. Aucun fichier réel n’a été analysé.';
    scanButton.disabled = false;
    document.querySelectorAll('.source-option').forEach(item => item.disabled = false);
    scanning = false;
  }, 1100);
});
const dialog = document.querySelector('#store-dialog');
document.querySelectorAll('[data-store]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#store-message').textContent = `Le lien DupliClean pour ${button.dataset.store} sera ajouté dès qu’il sera disponible. En attendant, découvrez le fonctionnement de l’application avec la démonstration sur cette page.`;
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
