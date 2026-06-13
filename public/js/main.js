// ============================================================
//  Coupe à la maison — animations de la page d'accueil
// ============================================================

// 1) Compte à rebours vers le PROCHAIN match (récupéré depuis l'API)
let KICKOFF = null;       // date du prochain match
let NEXT_LABEL = '';      // ex. "France - Sénégal"

async function loadNextMatch() {
  try {
    const matches = await (await fetch('/api/matches')).json();
    const now = new Date();
    const upcoming = (matches || [])
      .filter((m) => (m.status === 'SCHEDULED' || m.status === 'TIMED') && new Date(m.date) > now)
      .filter((m) => m.home !== 'À déterminer' && m.away !== 'À déterminer')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (upcoming.length) {
      KICKOFF = new Date(upcoming[0].date);
      NEXT_LABEL = upcoming[0].home + ' - ' + upcoming[0].away;
    }
  } catch (e) { /* on garde l'affichage par défaut */ }
  updateCountdown();
}

function updateCountdown() {
  const pad = (n) => String(n).padStart(2, '0');
  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  };
  const cap = document.getElementById('countdown-cap');

  // Pas de prochain match connu (tout est joué ou API indispo)
  if (!KICKOFF) {
    set('[data-d]', 0); set('[data-h]', '00'); set('[data-m]', '00'); set('[data-s]', '00');
    if (cap) cap.textContent = 'à très vite pour les prochains matchs';
    return;
  }

  let diff = KICKOFF - new Date();
  if (diff <= 0) {
    set('[data-d]', 0); set('[data-h]', '00'); set('[data-m]', '00'); set('[data-s]', '00');
    if (cap) cap.textContent = '🔴 ' + NEXT_LABEL + ' · c\'est maintenant !';
    return;
  }

  const days  = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);  diff -= hours * 3600000;
  const mins  = Math.floor(diff / 60000);    diff -= mins * 60000;
  const secs  = Math.floor(diff / 1000);

  set('[data-d]', days);
  set('[data-h]', pad(hours));
  set('[data-m]', pad(mins));
  set('[data-s]', pad(secs));
  if (cap) cap.textContent = 'avant ' + NEXT_LABEL;
}

loadNextMatch();
setInterval(updateCountdown, 1000);

// 2) Apparition en fondu des éléments quand ils entrent à l'écran
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// 3) Petit message pour les boutons pas encore actifs
const toast = document.getElementById('toast');
let toastTimer = null;

document.querySelectorAll('[data-soon]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  });
});
