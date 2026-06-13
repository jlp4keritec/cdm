// ============================================================
//  Coupe à la maison — page Palmarès (classement)
// ============================================================

function esc(s){ return String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

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
    return '<div class="rank-row lb-grid' + top + '">' +
      '<span class="rank-pos">' + medal + trendHtml(s.trend) + '</span>' +
      '<span class="rank-name">' + esc(s.pseudo) + (s.exact>0 ? ' <span class="name-target" title="' + s.exact + ' score' + (s.exact>1?'s':'') + ' exact' + (s.exact>1?'s':'') + '">🎯</span>' : '') + '</span>' +
      '<span class="lb-col">' + s.placed + '</span>' +
      '<span class="lb-col">' + (s.exact>0 ? '🎯 ' : '') + s.exact + '</span>' +
      '<span class="lb-col lb-pts">' + s.points + '</span>' +
    '</div>';
  }).join('');

  wrap.innerHTML = head + rows;
}

load();
