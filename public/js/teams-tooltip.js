// ============================================================
//  Coupe à la maison — infobulle de stats au survol d'une équipe
//  Marche partout : il suffit qu'un élément ait l'attribut data-team
// ============================================================

(function () {
  const GROUP_LABELS = {
    GROUP_A:'Groupe A', GROUP_B:'Groupe B', GROUP_C:'Groupe C', GROUP_D:'Groupe D',
    GROUP_E:'Groupe E', GROUP_F:'Groupe F', GROUP_G:'Groupe G', GROUP_H:'Groupe H',
    GROUP_I:'Groupe I', GROUP_J:'Groupe J', GROUP_K:'Groupe K', GROUP_L:'Groupe L'
  };

  let teamsMap = null;     // nom -> stats
  let tip = null;          // l'élément infobulle

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  }

  // Charge les équipes une seule fois
  async function ensureTeams() {
    if (teamsMap) return teamsMap;
    teamsMap = {};
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (Array.isArray(data)) data.forEach((t) => { teamsMap[t.name] = t; });
    } catch (e) {}
    return teamsMap;
  }

  function buildTip() {
    tip = document.createElement('div');
    tip.className = 'team-tip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
  }

  function fillTip(t) {
    const crest = t.crest
      ? '<img src="' + esc(t.crest) + '" alt="" />'
      : '<span class="tt-flag-ph"></span>';
    const group = GROUP_LABELS[t.group] || t.group || '';

    let info = '';
    if (t.rank || t.confLabel || t.participations != null || t.best) {
      info = '<div class="tt-info">' +
        (t.rank ? '<div class="tt-info-row"><span>Classement mondial</span><b>' + t.rank + 'e</b></div>' : '') +
        (t.confLabel ? '<div class="tt-info-row"><span>Confédération</span><b>' + esc(t.confLabel) + '</b></div>' : '') +
        (t.participations != null ? '<div class="tt-info-row"><span>Participations</span><b>' + t.participations + '</b></div>' : '') +
        (t.best ? '<div class="tt-info-row"><span>Meilleure perf.</span><b>' + esc(t.best) + '</b></div>' : '') +
      '</div>';
    }

    tip.innerHTML =
      '<div class="tt-head">' + crest +
        '<div><div class="tt-name">' + esc(t.name) + '</div>' +
        '<div class="tt-grp">' + esc(group) + ' · ' + (t.position ? t.position + 'e' : '—') + '</div></div>' +
      '</div>' +
      info +
      '<div class="tt-sub">Dans le tournoi</div>' +
      '<div class="tt-grid">' +
        ttStat('Matchs', t.played) +
        ttStat('Points', t.points) +
        ttStat('V', t.won) + ttStat('N', t.draw) + ttStat('D', t.lost) +
        ttStat('Buts', (t.gf ?? 0) + ':' + (t.ga ?? 0)) +
        ttStat('Diff.', (t.gd > 0 ? '+' : '') + (t.gd ?? 0)) +
      '</div>';
  }
  function ttStat(label, val) {
    return '<div class="tt-stat"><span class="tt-v">' + (val ?? 0) + '</span><span class="tt-l">' + label + '</span></div>';
  }

  function place(target) {
    const r = target.getBoundingClientRect();
    tip.style.visibility = 'hidden';
    tip.classList.add('show');
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - tw - 10));
    let top = r.top - th - 10;
    if (top < 10) top = r.bottom + 10; // bascule en dessous si pas de place
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.style.visibility = 'visible';
  }

  async function show(target) {
    const name = target.getAttribute('data-team');
    if (!name) return;
    await ensureTeams();
    const t = teamsMap[name];
    if (!t) return;            // pas de stats connues -> pas d'infobulle
    if (!tip) buildTip();
    fillTip(t);
    place(target);
  }
  function hide() { if (tip) tip.classList.remove('show'); }

  // Affichage au CLIC uniquement (plus au survol).
  let current = null;
  function isOpen() { return tip && tip.classList.contains('show'); }
  function toggle(target) {
    if (current === target && isOpen()) { hide(); current = null; }
    else { show(target); current = target; }
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-team]');
    if (target) { toggle(target); }
    else if (!(tip && tip.contains(e.target))) { hide(); current = null; }
  });

  // Accessibilité clavier : Entrée/Espace pour ouvrir, Échap pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest && e.target.closest('[data-team]');
      if (target) { e.preventDefault(); toggle(target); }
    } else if (e.key === 'Escape') { hide(); current = null; }
  });

  window.addEventListener('scroll', () => { hide(); current = null; }, true);
})();
