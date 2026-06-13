// ============================================================
//  Coupe à la maison — page « Où regarder » (matchs par chaîne)
//  Source des matchs : /api/matches (même données que le calendrier)
//  Règle de diffusion (officielle, juin 2026) :
//   - beIN Sports : les 104 matchs (abonnement)
//   - M6 / W9 (gratuit) : matchs de la France + demi-finales
//     + petite finale + finale (confirmés). Le reste de la
//     sélection M6 sera ajouté après les tirages.
// ============================================================

const GROUP_LABELS = {
  GROUP_A:'Groupe A', GROUP_B:'Groupe B', GROUP_C:'Groupe C', GROUP_D:'Groupe D',
  GROUP_E:'Groupe E', GROUP_F:'Groupe F', GROUP_G:'Groupe G', GROUP_H:'Groupe H',
  GROUP_I:'Groupe I', GROUP_J:'Groupe J', GROUP_K:'Groupe K', GROUP_L:'Groupe L'
};
const STAGE_LABELS = {
  GROUP_STAGE:'Phase de groupes',
  LAST_32:'16es de finale',
  LAST_16:'8es de finale',
  QUARTER_FINALS:'Quarts de finale',
  SEMI_FINALS:'Demi-finales',
  THIRD_PLACE:'3e place',
  FINAL:'Finale'
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}
function crestImg(url) {
  if (!url) return '<span class="m-flag-ph"></span>';
  return '<img src="' + escapeHtml(url) + '" alt="" loading="lazy" />';
}

// Ce match est-il diffusé en clair (M6 / W9) ? (uniquement les cas confirmés)
function isFreeM6(m) {
  if (m.home === 'France' || m.away === 'France') return true;
  if (m.stage === 'SEMI_FINALS') return true;
  if (m.stage === 'THIRD_PLACE') return true;
  if (m.stage === 'FINAL') return true;
  return false;
}

// Date "AAAA-MM-JJ" en heure de Paris (pour regrouper par jour)
function parisDateKey(d) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(d);
}

// Une ligne de match, avec une pastille de chaîne ("M6" ou "beIN")
function renderMatch(m, channel) {
  const d = new Date(m.date);
  const time = d.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
  const badge = m.group ? (GROUP_LABELS[m.group] || m.group) : (STAGE_LABELS[m.stage] || '');
  const teamAttr = (name) => (name && name !== 'À déterminer') ? ' data-team="' + escapeHtml(name) + '"' : '';

  const chan = channel === 'm6'
    ? '<span class="m-chan m6">M6 / W9</span>'
    : '<span class="m-chan bein">beIN Sports</span>';

  return '<div class="match-row">' +
    '<div class="m-meta">' +
      '<span class="m-time">' + time + '</span>' +
      (badge ? '<span class="m-badge">' + escapeHtml(badge) + '</span>' : '') +
      chan +
    '</div>' +
    '<div class="m-body">' +
      '<div class="m-team home"' + teamAttr(m.home) + '>' + crestImg(m.homeCrest) + '<span>' + escapeHtml(m.home) + '</span></div>' +
      '<div class="m-center"><span class="m-vs">VS</span></div>' +
      '<div class="m-team away"' + teamAttr(m.away) + '><span>' + escapeHtml(m.away) + '</span>' + crestImg(m.awayCrest) + '</div>' +
    '</div>' +
  '</div>';
}

// Regroupe une liste de matchs par jour (heure de Paris)
function renderByDay(list, channel) {
  const byDay = {};
  list.forEach((m) => {
    const key = parisDateKey(new Date(m.date));
    (byDay[key] = byDay[key] || []).push(m);
  });
  const todayKey = parisDateKey(new Date());

  return Object.keys(byDay).sort().map((key) => {
    const first = new Date(byDay[key][0].date);
    let label = first.toLocaleDateString('fr-FR', {
      timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long'
    });
    label = label.charAt(0).toUpperCase() + label.slice(1);
    const isToday = key === todayKey;
    const count = byDay[key].length;

    const rows = byDay[key]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((m) => renderMatch(m, channel)).join('');

    return '<div class="day-block">' +
      '<div class="day-head' + (isToday ? ' is-today' : '') + '">' +
        '<span class="day-label">' + label + (isToday ? " · Aujourd'hui" : '') + '</span>' +
        '<span class="day-count">' + count + ' match' + (count > 1 ? 's' : '') + '</span>' +
      '</div>' + rows +
    '</div>';
  }).join('');
}

// --- Chargement ---
async function loadTv() {
  const state = document.getElementById('tv-state');
  const freeWrap = document.getElementById('tv-free');
  const beinWrap = document.getElementById('tv-bein');
  try {
    const res = await fetch('/api/matches');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inconnue');

    if (!Array.isArray(data) || data.length === 0) {
      state.className = 'state';
      state.textContent = "Le calendrier n'est pas encore disponible. Reviens un peu plus tard !";
      return;
    }
    state.style.display = 'none';

    const free = data.filter(isFreeM6).sort((a, b) => new Date(a.date) - new Date(b.date));
    freeWrap.innerHTML = renderByDay(free, 'm6');
    beinWrap.innerHTML = renderByDay(data, 'bein');
  } catch (err) {
    state.className = 'state error';
    state.textContent = "Impossible de charger le programme. Détail : " + err.message;
  }
}

// --- Bascule entre les onglets M6 / beIN ---
function activateTv(view) {
  document.querySelectorAll('.subtab').forEach((b) => b.classList.toggle('is-active', b.dataset.tv === view));
  document.getElementById('tv-m6').classList.toggle('is-active', view === 'm6');
  document.getElementById('tv-bein-view').classList.toggle('is-active', view === 'bein');
}
document.querySelectorAll('.subtab').forEach((btn) => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.tv; // 'm6' ou 'bein'
    activateTv(view);
    try { localStorage.setItem('tv.view', view); } catch (e) {}
  });
});
// Restaurer le dernier onglet choisi
(function restoreTvView() {
  try {
    const v = localStorage.getItem('tv.view');
    if (v) activateTv(v);
  } catch (e) {}
})();

loadTv();
