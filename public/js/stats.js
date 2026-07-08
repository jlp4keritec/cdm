// ============================================================
//  Coupe à la maison — page Stats fun
// ============================================================

function esc(s){ return String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// Définition des titres : clé renvoyée par l'API -> présentation
const TITLES = [
  { key:'sniper',   ico:'🎯', name:'Le sniper',        desc:'le plus de scores exacts',          unit:'exacts' },
  { key:'voyant',   ico:'🔮', name:'Le voyant',         desc:'le plus de bons paris',             unit:'bons paris' },
  { key:'flambeur', ico:'🎲', name:'Le flambeur',       desc:'parie le plus de buts en moyenne',  unit:'buts/pari' },
  { key:'prudent',  ico:'🛡️', name:'Le prudent',        desc:'parie les plus petits scores',      unit:'buts/pari' },
  { key:'assidu',   ico:'✍️', name:'Le plus assidu',    desc:'le plus de paris placés',           unit:'paris' },
  { key:'casino',   ico:'🔥', name:'Le casino',         desc:'mise le plus de points',            unit:'pts misés' },
  { key:'groscoup', ico:'💰', name:'Le gros coup',      desc:'la plus grosse victoire sur un pari', unit:'pts' },
  { key:'joueur',   ico:'🃏', name:'Le joueur',         desc:'le plus de paris en mode spécial',  unit:'spéciaux' },
  { key:'crame',    ico:'📉', name:'Le cramé',          desc:'le plus de points perdus',          unit:'pts perdus' },
  { key:'rentable', ico:'🧨', name:'Le rentable',       desc:'meilleur bilan sur les modes spéciaux', unit:'pts' }
];

async function load(){
  const state = document.getElementById('stats-state');
  const wrap = document.getElementById('stats');
  let d;
  try { d = await (await fetch('/api/stats')).json(); }
  catch(e){ state.className='state error'; state.textContent='Impossible de charger les stats.'; return; }

  if (!d || !d.players){
    state.className='state';
    state.textContent="Aucun pari pour l'instant : les stats apparaîtront dès les premiers pronostics !";
    return;
  }
  state.hidden = true;
  wrap.hidden = false;

  // Cartes "titres"
  const cards = TITLES.map((t)=>{
    const w = d.titles[t.key];
    const winner = w ? esc(w.pseudo) : '—';
    const value = w ? (' · ' + w.value + ' ' + t.unit) : '';
    return '<div class="title-card">' +
      '<span class="title-ico">' + t.ico + '</span>' +
      '<div class="title-body">' +
        '<h3>' + t.name + '</h3>' +
        '<p class="title-desc">' + t.desc + '</p>' +
        '<p class="title-winner">' + winner + '<span class="title-val">' + value + '</span></p>' +
      '</div>' +
    '</div>';
  }).join('');
  document.getElementById('stats-titles').innerHTML = cards;

  // Stats générales
  const top = d.topScore ? (d.topScore.score + ' (' + d.topScore.count + '×)') : '—';
  const gen = [
    { ico:'👥', lab:'parieurs actifs', val:d.players },
    { ico:'🎟️', lab:'paris au total', val:d.totalBets },
    { ico:'⚽', lab:'buts pronostiqués / pari', val:d.avgGoals },
    { ico:'🏆', lab:'score le plus joué', val:top }
  ].map((g)=>
    '<div class="gen-card"><span class="gen-ico">'+g.ico+'</span><div class="gen-num">'+g.val+'</div><div class="gen-lab">'+g.lab+'</div></div>'
  ).join('');
  document.getElementById('stats-general').innerHTML = gen;
}

load();
