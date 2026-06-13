// ============================================================
//  Coupe à la maison — page Équipes
// ============================================================

const GROUP_LABELS = {
  GROUP_A:'Groupe A', GROUP_B:'Groupe B', GROUP_C:'Groupe C', GROUP_D:'Groupe D',
  GROUP_E:'Groupe E', GROUP_F:'Groupe F', GROUP_G:'Groupe G', GROUP_H:'Groupe H',
  GROUP_I:'Groupe I', GROUP_J:'Groupe J', GROUP_K:'Groupe K', GROUP_L:'Groupe L'
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}
function crest(url) {
  return url ? '<img src="' + escapeHtml(url) + '" alt="" loading="lazy" />' : '<span class="tt-flag-ph"></span>';
}

async function loadTeams() {
  const state = document.getElementById('teams-state');
  const groupWrap = document.getElementById('teams-group');
  const rankWrap = document.getElementById('teams-rank');
  try {
    const res = await fetch('/api/teams');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inconnue');

    if (!Array.isArray(data) || data.length === 0) {
      state.className = 'state';
      state.textContent = "Les équipes ne sont pas encore disponibles. Reviens un peu plus tard !";
      return;
    }
    state.style.display = 'none';

    groupWrap.innerHTML = renderByGroup(data);
    rankWrap.innerHTML = renderByRank(data);
  } catch (err) {
    state.className = 'state error';
    state.textContent = "Impossible de charger les équipes. Détail : " + err.message;
  }
}

// Vue 1 : par groupe
function renderByGroup(data) {
  const byGroup = {};
  data.forEach((t) => { (byGroup[t.group] = byGroup[t.group] || []).push(t); });

  return Object.keys(byGroup).sort().map((g, gi) => {
    const cards = byGroup[g]
      .sort((a, b) => (a.position || 99) - (b.position || 99) || a.name.localeCompare(b.name))
      .map((t) => {
        const qualified = t.position <= 2 ? ' qualified' : '';
        const debut = t.debut ? '<span class="tc-debut">Débutant</span>' : '';
        const info = (t.rank || t.confLabel || t.participations != null || t.best) ?
          '<div class="tc-info">' +
            (t.rank ? '<span class="tc-rank">Classement mondial · ' + t.rank + '<sup>e</sup></span>' : '') +
            (t.confLabel ? '<span class="tc-conf">' + escapeHtml(t.confLabel) + '</span>' : '') +
            (t.participations != null ? '<span>🏆 ' + t.participations + (t.participations > 1 ? ' participations' : ' participation') + '</span>' : '') +
            (t.best ? '<span>★ ' + escapeHtml(t.best) + '</span>' : '') +
          '</div>' : '';
        return '<div class="team-card' + qualified + '" data-team="' + escapeHtml(t.name) + '" tabindex="0">' +
          debut +
          '<div class="tc-flag">' + crest(t.crest) + '</div>' +
          '<div class="tc-name">' + escapeHtml(t.name) + '</div>' +
          info +
          '<div class="tc-stats">' +
            '<span class="tc-pts">' + (t.points ?? 0) + ' pts</span>' +
          '</div>' +
        '</div>';
      }).join('');

    return '<section class="grp-block" style="animation-delay:' + (gi * 50) + 'ms">' +
      '<h2 class="grp-title">' + (GROUP_LABELS[g] || g) + '</h2>' +
      '<div class="teams-grid">' + cards + '</div>' +
    '</section>';
  }).join('');
}

// Vue 2 : par classement mondial FIFA
function renderByRank(data) {
  // Les équipes classées d'abord (rang croissant), les autres à la fin
  const ranked = data.slice().sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank) return -1;
    if (b.rank) return 1;
    return a.name.localeCompare(b.name);
  });

  const rows = ranked.map((t) => {
    const top = t.rank && t.rank <= 3 ? ' top' + t.rank : '';
    const rankTxt = t.rank ? t.rank : '—';
    const meta = [];
    if (t.confLabel) meta.push(escapeHtml(t.confLabel));
    if (GROUP_LABELS[t.group]) meta.push(GROUP_LABELS[t.group]);
    return '<div class="rank-row' + top + '" data-team="' + escapeHtml(t.name) + '" tabindex="0">' +
      '<span class="rank-pos">' + rankTxt + '</span>' +
      '<span class="rank-flag">' + crest(t.crest) + '</span>' +
      '<span class="rank-name">' + escapeHtml(t.name) + '</span>' +
      '<span class="rank-meta">' + meta.join(' · ') + '</span>' +
    '</div>';
  }).join('');

  return '<div class="rank-head">' +
      '<span class="rank-pos">#</span><span></span>' +
      '<span class="rank-name">Équipe</span>' +
      '<span class="rank-meta">Confédération · Groupe</span>' +
    '</div>' + rows;
}

// Sous-onglets (par groupe / par classement) — choix mémorisé
function activateView(view) {
  document.querySelectorAll('.subtab').forEach((b) => b.classList.toggle('is-active', b.dataset.view === view));
  document.getElementById('teams-group').classList.toggle('is-active', view === 'group');
  document.getElementById('teams-rank').classList.toggle('is-active', view === 'rank');
}
document.querySelectorAll('.subtab').forEach((btn) => {
  btn.addEventListener('click', () => {
    activateView(btn.dataset.view);
    try { localStorage.setItem('equipes.view', btn.dataset.view); } catch (e) {}
  });
});
(function () {
  try {
    const v = localStorage.getItem('equipes.view');
    if (v) activateView(v);
  } catch (e) {}
})();

// Toast pour boutons pas encore actifs
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

loadTeams();
