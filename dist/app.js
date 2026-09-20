document
  .querySelectorAll('.reference-bottom-copy > span, .reference-about-label, .section-kicker')
  .forEach((element) => {
    element.textContent = element.textContent.replaceAll('✳', '*');
  });

let currentSource = 'Téléphone';
let scanning = false;
let awaitingConfirmation = false;
let activeCategory = '';
const scanButton = document.querySelector('#scan-button');
const status = document.querySelector('#scan-status');
const categories = document.querySelector('#demo-categories');
const results = document.querySelector('#demo-results');
const fileList = document.querySelector('#demo-file-list');
const deleteButton = document.querySelector('#demo-delete');
const samples = {
  similar: { title: 'Photos similaires', files: ['Vacances_01.jpg', 'Vacances_02.jpg'], note: 'Exemples fictifs : la similarité est une estimation à vérifier.' },
  large: { title: 'Fichiers volumineux', files: ['Video_vacances.mp4'], note: 'Exemple fictif de fichier volumineux, à vérifier avant toute suppression.' },
  screenshots: { title: 'Captures d’écran', files: ['Capture_01.png', 'Capture_02.png'], note: 'Exemples fictifs de captures d’écran à examiner.' }
};
function resetResults() {
  categories.hidden = true;
  results.hidden = true;
  awaitingConfirmation = false;
  activeCategory = '';
}
function selectionChanged() {
  awaitingConfirmation = false;
  const count = fileList.querySelectorAll('input:checked').length;
  deleteButton.disabled = count === 0;
  deleteButton.textContent = count ? `Vérifier la sélection (${count})` : 'Choisir au moins un fichier';
}
function openCategory(key) {
  activeCategory = key;
  const sample = samples[key];
  categories.hidden = true;
  results.hidden = false;
  document.querySelector('#demo-result-heading').textContent = sample.title + ' · Exemples fictifs';
  fileList.replaceChildren();
  sample.files.forEach(name => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.addEventListener('change', selectionChanged);
    const text = document.createElement('span');
    text.textContent = name;
    label.append(input, text);
    fileList.append(label);
  });
  selectionChanged();
  status.textContent = sample.note + ' Aucun fichier réel n’est lu ou supprimé.';
  document.querySelector('#demo-back').focus();
}
function showCategories() {
  categories.innerHTML = `<div class="demo-scan-complete"><span aria-hidden="true">✓</span><div><strong>Scan terminé</strong><p>1 469 fichiers vérifiés · Exemple fourni</p><small>3 catégories avec des résultats</small></div></div><h3>Éléments trouvés</h3><p class="demo-categories-intro">Ouvrez une catégorie pour examiner ses fichiers.</p><button class="demo-category exact" disabled><span class="demo-category-icon">▤</span><span><strong>Doublons exacts</strong><small>Fichiers au contenu identique.</small><b>Aucun doublon exact trouvé</b></span><span aria-hidden="true">✓</span></button><button class="demo-category similar" data-category="similar"><span class="demo-category-icon">▧</span><span><strong>Photos similaires</strong><small>Photos proches visuellement.</small><b>47 groupes · 100 photos</b></span><span aria-hidden="true">›</span></button><button class="demo-category large" data-category="large"><span class="demo-category-icon">▤</span><span><strong>Fichiers volumineux</strong><small>Photos et vidéos triées par taille.</small><b>1 fichier · 134,9 Mo</b></span><span aria-hidden="true">›</span></button><button class="demo-category screenshots" data-category="screenshots"><span class="demo-category-icon">⌗</span><span><strong>Captures d’écran</strong><small>Dans les albums et dossiers sélectionnés.</small><b>36 captures · 32,2 Mo</b></span><span aria-hidden="true">›</span></button><p class="demo-safety">✓ Rien n’a été supprimé. Ouvrez une catégorie et choisissez ce que vous souhaitez retirer.</p>`;
  categories.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => openCategory(button.dataset.category)));
  categories.hidden = false;
}
document.querySelectorAll('.source-option').forEach(button => {
  button.addEventListener('click', () => {
    if (scanning) return;
    currentSource = button.dataset.source;
    document.querySelectorAll('.source-option').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    resetResults();
    document.querySelector('#summary-label').textContent = 'Votre source de démonstration';
    document.querySelector('#scan-size').textContent = currentSource;
    document.querySelector('#scan-caption').textContent = currentSource === 'Téléphone' ? 'Médias autorisés dans Android' : 'Autorisation auprès de ' + (currentSource === 'OneDrive' ? 'Microsoft' : 'Google');
    status.textContent = `Démonstration ${currentSource} · Aucun compte connecté, aucun accès à vos fichiers.`;
    scanButton.innerHTML = 'Lancer la démo d’analyse <span>↗</span>';
  });
});
scanButton.addEventListener('click', () => {
  if (scanning) return;
  resetResults();
  scanning = true;
  scanButton.disabled = true;
  document.querySelectorAll('.source-option').forEach(item => item.disabled = true);
  scanButton.textContent = 'Préparation de l’exemple…';
  status.textContent = 'Simulation d’analyse · Aucun accès à vos fichiers.';
  setTimeout(() => {
    document.querySelector('#summary-label').textContent = 'Résultats illustratifs · ' + currentSource;
    document.querySelector('#scan-size').textContent = '4 catégories';
    document.querySelector('#scan-caption').textContent = 'Ouvrez les catégories contenant des résultats';
    showCategories();
    scanButton.innerHTML = 'Rejouer la démonstration <span>↻</span>';
    status.textContent = 'Exemple basé sur la capture fournie. Les résultats réels varient selon vos fichiers et la source.';
    scanButton.disabled = false;
    document.querySelectorAll('.source-option').forEach(item => item.disabled = false);
    scanning = false;
    categories.setAttribute('tabindex', '-1');
    categories.focus({ preventScroll: true });
    categories.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, 900);
});
document.querySelector('#demo-back').addEventListener('click', () => {
  results.hidden = true;
  categories.hidden = false;
  awaitingConfirmation = false;
  categories.querySelector(`[data-category="${activeCategory}"]`).focus();
  status.textContent = 'Aucun fichier supprimé. Les chiffres affichés sont un exemple fourni, pas vos résultats.';
});
deleteButton.addEventListener('click', () => {
  const count = fileList.querySelectorAll('input:checked').length;
  if (!count) return;
  if (!awaitingConfirmation) {
    awaitingConfirmation = true;
    deleteButton.textContent = `Confirmer la simulation (${count})`;
    status.textContent = 'Vérifiez votre sélection. Dans l’application, la suppression dépend d’Android ou du fournisseur cloud et la restauration n’est pas garantie. Ici, elle sera uniquement simulée.';
    return;
  }
  resetResults();
  status.textContent = `Simulation terminée pour ${count} fichier${count > 1 ? 's' : ''} fictif${count > 1 ? 's' : ''}. Aucun fichier réel n’a été supprimé.`;
  scanButton.focus();
});
const dialog = document.querySelector('#store-dialog');
document.querySelectorAll('[data-store]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#store-message').textContent = 'DupliClean est disponible uniquement sur Google Play. Le lien direct vers sa fiche doit encore être renseigné sur ce site. Vous pouvez découvrir l’application avec la démonstration sur cette page.';
  dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
