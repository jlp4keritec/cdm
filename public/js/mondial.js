// ============================================================
//  Coupe à la maison — page « Mondial » (stats du tournoi)
//  Sources :
//   - /api/scorers : meilleurs buteurs (classement officiel API)
//   - /api/teams   : stats par équipe (buts pour / contre)
//   - /api/matches : tous les matchs (pour les plus prolifiques)
// ============================================================

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
// Petite médaille pour le podium (1,2,3), sinon le numéro
function rankBadge(pos) {
  if (pos === 1) return '🥇';
  if (pos === 2) return '🥈';
  if (pos === 3) return '🥉';
  return '<span class="pos">' + pos + '</span>';
}

// ---------- Onglet 1 : Meilleurs buteurs ----------
function renderButeurs(scorers) {
  const wrap = document.getElementById('buteurs-wrap');
  if (!scorers.length) {
    wrap.innerHTML = '<div class="state">Aucun buteur pour l\'instant — le classement se remplira dès les premiers matchs.</div>';
    return;
  }
  let rows = '';
  scorers.forEach((s) => {
    rows +=
      '<tr>' +
        '<td class="left rank-cell">' + rankBadge(s.position) + '</td>' +
        '<td class="left"><span class="player-name">' + escapeHtml(s.player) + '</span></td>' +
        '<td class="left"><span class="team-cell">' + crestImg(s.crest) + escapeHtml(s.team) + '</span></td>' +
        '<td class="goals">' + s.goals + '</td>' +
      '</tr>';
  });
  wrap.innerHTML =
    '<div class="stat-card">' +
      '<table class="standings stat-table">' +
        '<thead><tr>' +
          '<th class="left">#</th><th class="left">Joueur</th>' +
          '<th class="left">Équipe</th><th>Buts</th>' +
        '</tr></thead><tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
}

// ---------- Onglets 2 & 3 : Attaques / Défenses (depuis /api/teams) ----------
// metric = 'gf' (buts marqués, tri décroissant) ou 'ga' (buts encaissés, tri croissant)
function renderTeamRanking(teams, metric, wrapId, label) {
  const wrap = document.getElementById(wrapId);
  // on ne garde que les équipes ayant joué au moins un match
  const played = teams.filter((t) => t.played > 0);
  if (!played.length) {
    wrap.innerHTML = '<div class="state">Le classement apparaîtra dès que des matchs auront été joués.</div>';
    return;
  }
  const sorted = played.slice().sort((a, b) =>
    metric === 'gf'
      ? (b.gf - a.gf) || (a.ga - b.ga) || a.name.localeCompare(b.name)
      : (a.ga - b.ga) || (b.gf - a.gf) || a.name.localeCompare(b.name)
  ).slice(0, 10);

  let rows = '';
  sorted.forEach((t, i) => {
    const value = metric === 'gf' ? t.gf : t.ga;
    rows +=
      '<tr>' +
        '<td class="left rank-cell">' + rankBadge(i + 1) + '</td>' +
        '<td class="left"><span class="team-cell">' + crestImg(t.crest) + escapeHtml(t.name) + '</span></td>' +
        '<td>' + t.played + '</td>' +
        '<td class="goals">' + value + '</td>' +
      '</tr>';
  });
  wrap.innerHTML =
    '<div class="stat-card">' +
      '<table class="standings stat-table">' +
        '<thead><tr>' +
          '<th class="left">#</th><th class="left">Équipe</th>' +
          '<th>Joués</th><th>' + label + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody>' +
      '</table>' +
    '</div>';
}

// ---------- Onglet 4 : Matchs les plus prolifiques ----------
function renderProlifiques(matches) {
  const wrap = document.getElementById('prolifiques-wrap');
  const done = matches
    .filter((m) => m.status === 'FINISHED' && m.scoreHome != null && m.scoreAway != null)
    .map((m) => ({ ...m, total: m.scoreHome + m.scoreAway }))
    .sort((a, b) => b.total - a.total || new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  if (!done.length) {
    wrap.innerHTML = '<div class="state">Aucun match terminé pour l\'instant.</div>';
    return;
  }

  let html = '';
  done.forEach((m) => {
    const stage = STAGE_LABELS[m.stage] || '';
    html +=
      '<div class="match-row">' +
        '<div class="m-meta">' +
          '<span class="m-badge total-badge">' + m.total + ' buts</span>' +
          (stage ? '<span class="m-sub">' + escapeHtml(stage) + '</span>' : '') +
        '</div>' +
        '<div class="m-body">' +
          '<div class="m-team">' + crestImg(m.homeCrest) + escapeHtml(m.home) + '</div>' +
          '<div class="m-center"><span class="m-score">' + m.scoreHome + ' – ' + m.scoreAway + '</span></div>' +
          '<div class="m-team away">' + escapeHtml(m.away) + crestImg(m.awayCrest) + '</div>' +
        '</div>' +
      '</div>';
  });
  wrap.innerHTML = html;
}

// ---------- Onglets (bascule) ----------
function setupTabs() {
  const tabs = document.querySelectorAll('.subtab');
  const views = {
    buteurs:     document.getElementById('tab-buteurs'),
    attaque:     document.getElementById('tab-attaque'),
    defense:     document.getElementById('tab-defense'),
    prolifiques: document.getElementById('tab-prolifiques')
  };
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      Object.values(views).forEach((v) => v.classList.remove('is-active'));
      views[btn.dataset.tab].classList.add('is-active');
    });
  });
}

// ---------- Chargement ----------
async function load() {
  const state = document.getElementById('mondial-state');
  setupTabs();
  try {
    const [scorers, teams, matches] = await Promise.all([
      fetch('/api/scorers').then((r) => r.json()),
      fetch('/api/teams').then((r) => r.json()),
      fetch('/api/matches').then((r) => r.json())
    ]);

    if (scorers && scorers.error) throw new Error(scorers.error);

    renderButeurs(Array.isArray(scorers) ? scorers : []);
    renderTeamRanking(Array.isArray(teams) ? teams : [], 'gf', 'attaque-wrap', 'Buts marqués');
    renderTeamRanking(Array.isArray(teams) ? teams : [], 'ga', 'defense-wrap', 'Buts encaissés');
    renderProlifiques(Array.isArray(matches) ? matches : []);

    state.style.display = 'none';
  } catch (err) {
    state.className = 'state error';
    state.textContent = 'Impossible de charger les stats : ' + err.message;
  }
}

load();
