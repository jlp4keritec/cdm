// ============================================================
//  Coupe à la maison — page Palmarès (classement)
//  Clique sur un parieur pour déplier les matchs qui lui ont
//  rapporté des points.
// ============================================================

function esc(s){ return String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// Date courte « 14 juin » à partir d'une date ISO
function shortDate(iso){
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch (e) { return ''; }
}

// Bloc détail : la liste des matchs gagnants d'un joueur
function detailHtml(breakdown){
  if (!Array.isArray(breakdown) || breakdown.length === 0) return '';
  const items = breakdown.map((b) => {
    const mode = b.mode || 'normal';
    const p = b.points;
    let badge, tag = '';

    if (p < 0) {
      // Pari misé perdu → ligne rouge
      badge = '<span class="bd-pts bd-loss">' + p + ' pts</span>';
    } else if (mode === 'qod') {
      badge = '<span class="bd-pts bd-game">🎲 +' + p + ' pts</span>';
    } else if (mode === 'joker') {
      badge = '<span class="bd-pts bd-game">🃏 +' + p + (p > 1 ? ' pts' : ' pt') + '</span>';
    } else if (p === 3) {
      badge = '<span class="bd-pts bd-exact">🎯 3 pts</span>';
    } else if (p === 2) {
      badge = '<span class="bd-pts bd-good">🎯 2 pts</span>';
    } else {
      badge = '<span class="bd-pts bd-good">✓ 1 pt</span>';
    }

    if (mode === 'qod')   tag = '<span class="bd-mode">🎲 Quitte ou double · mise ' + (b.stake || 0) + '</span>';
    if (mode === 'joker') tag = '<span class="bd-mode">🃏 Joker</span>';

    return '<div class="bd-row' + (p < 0 ? ' is-loss' : '') + '">' +
      '<span class="bd-date">' + esc(shortDate(b.date)) + '</span>' +
      '<span class="bd-teams">' + esc(b.home) +
        ' <strong>' + b.scoreHome + ' – ' + b.scoreAway + '</strong> ' + esc(b.away) +
        tag +
      '</span>' +
      '<span class="bd-prono">ton prono : ' + b.predHome + ' – ' + b.predAway + '</span>' +
      badge +
    '</div>';
  }).join('');
  return '<div class="rank-detail" hidden>' + items + '</div>';
}

async function load(){
  const state = document.getElementById('lb-state');
  const wrap = document.getElementById('leaderboard');
  let data;
  try { data = await (await fetch('/api/leaderboard')).json(); }
  catch (e) { state.className='state error'; state.textContent='Impossible de charger le classement.'; return; }

  if (!Array.isArray(data) || data.length === 0){
    state.className='state';
    state.textContent="Aucun parieur pour l'instant. Crée un compte et fais tes pronos !";
    return;
  }
  state.style.display='none';

  const head = '<div class="rank-head lb-grid">' +
    '<span class="rank-pos">#</span>' +
    '<span class="rank-name">Parieur</span>' +
    '<span class="lb-col">Pronos</span>' +
    '<span class="lb-col">Exacts</span>' +
    '<span class="lb-col lb-pts">Points</span>' +
  '</div>';

  function trendHtml(t){
    if (t === 'up')   return '<span class="trend up" title="En hausse">▲</span>';
    if (t === 'down') return '<span class="trend down" title="En baisse">▼</span>';
    if (t === 'new')  return '<span class="trend new" title="Nouveau">NEW</span>';
    if (t === 'same') return '<span class="trend same" title="Stable">–</span>';
    return '';  // 'none' : pas encore d'historique
  }

  const rows = data.map((s) => {
    const top = s.rank <= 3 ? ' top' + s.rank : '';
    const medal = s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : s.rank;
    const hasDetail = Array.isArray(s.breakdown) && s.breakdown.length > 0;
    const caret = hasDetail ? '<span class="rank-caret" aria-hidden="true">▾</span>' : '';
    const rowAttrs = hasDetail
      ? ' class="rank-row lb-grid is-clickable' + top + '" role="button" tabindex="0" aria-expanded="false"'
      : ' class="rank-row lb-grid' + top + '"';

    const row = '<div' + rowAttrs + '>' +
      '<span class="rank-pos">' + medal + trendHtml(s.trend) + '</span>' +
      '<span class="rank-name">' + esc(s.pseudo) +
        (s.exact>0 ? ' <span class="name-target" title="' + s.exact + ' score' + (s.exact>1?'s':'') + ' exact' + (s.exact>1?'s':'') + '">🎯</span>' : '') +
        caret +
      '</span>' +
      '<span class="lb-col">' + s.placed + '</span>' +
      '<span class="lb-col">' + (s.exact>0 ? '🎯 ' : '') + s.exact + '</span>' +
      '<span class="lb-col lb-pts">' + s.points + '</span>' +
    '</div>';

    return '<div class="rank-block">' + row + detailHtml(s.breakdown) + '</div>';
  }).join('');

  wrap.innerHTML = head + rows;

  // Clic / clavier : déplier-replier le détail d'un parieur
  function toggle(rowEl){
    const block = rowEl.closest('.rank-block');
    if (!block) return;
    const detail = block.querySelector('.rank-detail');
    if (!detail) return;
    const open = !detail.hasAttribute('hidden');
    if (open) { detail.setAttribute('hidden', ''); rowEl.setAttribute('aria-expanded', 'false'); }
    else      { detail.removeAttribute('hidden');  rowEl.setAttribute('aria-expanded', 'true');  }
    rowEl.classList.toggle('is-open', !open);
  }

  wrap.addEventListener('click', (e) => {
    const row = e.target.closest('.rank-row.is-clickable');
    if (row) toggle(row);
  });
  wrap.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest('.rank-row.is-clickable');
    if (row) { e.preventDefault(); toggle(row); }
  });
}

load();
