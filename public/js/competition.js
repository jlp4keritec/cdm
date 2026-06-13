// ============================================================
//  Coupe à la maison — page Compétition
// ============================================================

// --- Onglets ---
function activateTab(target) {
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === target));
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('is-active', p.id === target));
}
document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    activateTab(target);
    try { localStorage.setItem('comp.tab', target); } catch (e) {}
  });
});

// --- Noms lisibles ---
const GROUP_LABELS = {
  GROUP_A:'Groupe A', GROUP_B:'Groupe B', GROUP_C:'Groupe C', GROUP_D:'Groupe D',
  GROUP_E:'Groupe E', GROUP_F:'Groupe F', GROUP_G:'Groupe G', GROUP_H:'Groupe H',
  GROUP_I:'Groupe I', GROUP_J:'Groupe J', GROUP_K:'Groupe K', GROUP_L:'Groupe L'
};
const STAGE_ORDER = ['GROUP_STAGE','LAST_32','LAST_16','QUARTER_FINALS','SEMI_FINALS','THIRD_PLACE','FINAL'];
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

// --- Charger les POULES ---
async function loadGroups() {
  const state = document.getElementById('groups-state');
  const wrap = document.getElementById('groups');
  try {
    const res = await fetch('/api/groups');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inconnue');

    if (!Array.isArray(data) || data.length === 0) {
      state.className = 'state';
      state.textContent = "Les poules ne sont pas encore disponibles. Reviens un peu plus tard !";
      return;
    }
    state.style.display = 'none';

    wrap.innerHTML = data.map((g, i) => {
      const rows = g.table.map((r) => {
        const qualified = r.position <= 2 ? ' class="qualified"' : '';
        return '<tr' + qualified + '>' +
          '<td><span class="pos">' + r.position + '</span></td>' +
          '<td class="left"><span class="team-cell" data-team="' + escapeHtml(r.team) + '">' + crestImg(r.crest) +
            '<span>' + escapeHtml(r.team) + '</span></span></td>' +
          '<td>' + (r.played ?? 0) + '</td>' +
          '<td>' + (r.gd > 0 ? '+' : '') + (r.gd ?? 0) + '</td>' +
          '<td class="pts">' + (r.points ?? 0) + '</td>' +
        '</tr>';
      }).join('');

      return '<div class="group-card" style="animation-delay:' + (i * 50) + 'ms">' +
        '<div class="group-name">' + (GROUP_LABELS[g.group] || g.group) + '</div>' +
        '<table class="standings"><thead><tr>' +
          '<th></th><th class="left">Équipe</th><th>J</th><th>Diff</th><th>Pts</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>' +
      '</div>';
    }).join('');
  } catch (err) {
    state.className = 'state error';
    state.textContent = "Impossible de charger les poules. Détail : " + err.message;
  }
}

// --- Charger le CALENDRIER (deux vues : par jour et par tour) ---
async function loadMatches() {
  const state = document.getElementById('matches-state');
  const dayWrap = document.getElementById('matches-day');
  const stageWrap = document.getElementById('matches-stage');
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

    dayWrap.innerHTML = renderByDay(data);
    stageWrap.innerHTML = renderByStage(data);
  } catch (err) {
    state.className = 'state error';
    state.textContent = "Impossible de charger le calendrier. Détail : " + err.message;
  }
}

// Donne la date "AAAA-MM-JJ" d'un match en heure de Paris
function parisDateKey(d) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(d);
}

// Vue 1 : par jour
function renderByDay(data) {
  const byDay = {};
  data.forEach((m) => {
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
      .map((m) => renderMatch(m)).join('');

    return '<div class="day-block">' +
      '<div class="day-head' + (isToday ? ' is-today' : '') + '">' +
        '<span class="day-label">' + label + (isToday ? " · Aujourd'hui" : '') + '</span>' +
        '<span class="day-count">' + count + ' match' + (count > 1 ? 's' : '') + '</span>' +
      '</div>' + rows +
    '</div>';
  }).join('');
}

// Vue 2 : par tour (l'ancienne)
function renderByStage(data) {
  const byStage = {};
  data.forEach((m) => {
    const s = m.stage || 'GROUP_STAGE';
    (byStage[s] = byStage[s] || []).push(m);
  });
  const stages = Object.keys(byStage).sort(
    (a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b)
  );
  return stages.map((stage) => {
    const rows = byStage[stage]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((m) => renderMatch(m, true)).join('');
    return '<div class="stage-block">' +
      '<div class="day-head"><span class="day-label">' +
        (STAGE_LABELS[stage] || stage) + '</span></div>' +
      rows + '</div>';
  }).join('');
}

function renderMatch(m, showDate) {
  const d = new Date(m.date);
  const time = d.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
  // En vue "par tour", on ajoute la date à côté de l'heure (pas de bandeau de jour).
  const when = showDate
    ? (d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + time)
    : time;
  const finished = m.status === 'FINISHED';
  const live = m.status === 'IN_PLAY' || m.status === 'PAUSED';
  const hasScore = m.scoreHome !== null && m.scoreAway !== null;

  // Badge : groupe (phase de groupes) ou nom du tour (phases finales)
  const badge = m.group ? (GROUP_LABELS[m.group] || m.group) : (STAGE_LABELS[m.stage] || '');

  // Lieu du match (si fourni par l'API)
  const venue = m.venue ? '<span class="m-venue">📍 ' + escapeHtml(m.venue) + '</span>' : '';

  const teamAttr = (name) => (name && name !== 'À déterminer') ? ' data-team="' + escapeHtml(name) + '"' : '';

  let center;
  if (live || finished || (hasScore && m.status !== 'SCHEDULED' && m.status !== 'TIMED')) {
    center = '<span class="m-score">' + (m.scoreHome ?? 0) + ' - ' + (m.scoreAway ?? 0) + '</span>';
    if (live) center += '<span class="m-live">EN DIRECT</span>';
    else if (finished) center += '<span class="m-status">Terminé</span>';
  } else {
    center = '<span class="m-vs">VS</span>';
  }

  return '<div class="match-row">' +
    '<div class="m-meta">' +
      '<span class="m-time">' + when + '</span>' +
      (badge ? '<span class="m-badge">' + escapeHtml(badge) + '</span>' : '') +
      venue +
    '</div>' +
    '<div class="m-body">' +
      '<div class="m-team home"' + teamAttr(m.home) + '>' + crestImg(m.homeCrest) + '<span>' + escapeHtml(m.home) + '</span></div>' +
      '<div class="m-center">' + center + '</div>' +
      '<div class="m-team away"' + teamAttr(m.away) + '><span>' + escapeHtml(m.away) + '</span>' + crestImg(m.awayCrest) + '</div>' +
    '</div>' +
  '</div>';
}

// --- Sous-onglets du calendrier (par jour / par tour) ---
function activateView(view) {
  document.querySelectorAll('.subtab').forEach((b) => b.classList.toggle('is-active', b.dataset.view === view));
  document.getElementById('matches-day').classList.toggle('is-active', view === 'day');
  document.getElementById('matches-stage').classList.toggle('is-active', view === 'stage');
}
document.querySelectorAll('.subtab').forEach((btn) => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view; // 'day' ou 'stage'
    activateView(view);
    try { localStorage.setItem('comp.view', view); } catch (e) {}
  });
});

// Restaurer les choix mémorisés
(function restoreChoices() {
  try {
    const tab = localStorage.getItem('comp.tab');
    if (tab) activateTab(tab);
    const view = localStorage.getItem('comp.view');
    if (view) activateView(view);
  } catch (e) {}
})();

// Onglet piloté par l'ancre d'URL et le menu (les boutons d'onglet ont été retirés)
function syncTabFromHash() {
  const h = (location.hash || '').replace('#', '');
  const tab = (h === 'calendrier') ? 'calendrier' : 'poules';
  activateTab(tab);
  // Refléter l'onglet courant dans le menu (Poules / Calendrier)
  document.querySelectorAll('.nav-links a[href*="/competition#"]').forEach((a) => {
    const on = a.getAttribute('href').endsWith('#' + tab);
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', syncTabFromHash);
syncTabFromHash();

// --- Toast pour boutons pas encore actifs ---
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

// Lancement
loadGroups();
loadMatches();
