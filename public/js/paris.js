// ============================================================
//  Coupe à la maison — page Pronostics (paris)
// ============================================================

const GROUP_LABELS = {
  GROUP_A:'Groupe A', GROUP_B:'Groupe B', GROUP_C:'Groupe C', GROUP_D:'Groupe D',
  GROUP_E:'Groupe E', GROUP_F:'Groupe F', GROUP_G:'Groupe G', GROUP_H:'Groupe H',
  GROUP_I:'Groupe I', GROUP_J:'Groupe J', GROUP_K:'Groupe K', GROUP_L:'Groupe L'
};
const STAGE_LABELS = {
  GROUP_STAGE:'Phase de groupes', LAST_32:'16es', LAST_16:'8es',
  QUARTER_FINALS:'Quarts', SEMI_FINALS:'Demies', THIRD_PLACE:'3e place', FINAL:'Finale'
};

function esc(s){ return String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function crest(url){ return url ? '<img src="'+esc(url)+'" alt="" loading="lazy" />' : '<span class="m-flag-ph"></span>'; }
function teamAttr(name){ return (name && name!=='À déterminer') ? ' data-team="'+esc(name)+'"' : ''; }

const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(text, ok){
  if(!toast) return;
  toast.textContent = text;
  toast.style.background = ok ? 'linear-gradient(100deg, var(--blue), var(--lime))' : 'linear-gradient(100deg, var(--blue), var(--magenta))';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 2200);
}

let MY_BETS = {};   // matchId -> {home, away, points}

function isBettable(m){
  if(!m) return false;
  if(m.home==='À déterminer' || m.away==='À déterminer') return false;
  const notStarted = m.status==='SCHEDULED' || m.status==='TIMED';
  return notStarted && new Date(m.date) > new Date();
}

function fmtDateTime(d){
  return new Date(d).toLocaleString('fr-FR',{timeZone:'Europe/Paris',weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
}

// Sélecteur de buts : petite liste (0 à 15) + ballons (1 à 5), et un grand chiffre d'affichage
function goalPicker(side, val){
  const v = (val != null) ? val : 0;          // 0 par défaut
  let opts = '';
  for (let n = 0; n <= 15; n++){
    opts += '<option value="' + n + '"' + (v === n ? ' selected' : '') + '>' + n + '</option>';
  }
  let balls = '';
  for (let n = 1; n <= 5; n++){
    balls += '<button type="button" class="ball" data-n="' + n + '" aria-label="' + n + ' but' + (n>1?'s':'') + '">⚽</button>';
  }
  return '<div class="goal-picker" data-side="' + side + '">' +
    '<div class="balls">' +
      '<select class="goal-select" data-side="' + side + '" aria-label="Buts ' + side + '">' + opts + '</select>' +
      balls +
    '</div>' +
    '<div class="bet-num" data-side="' + side + '">' + v + '</div>' +
  '</div>';
}

// Phrase "Kikko pronostique ... . Choisis ton score" + bulle d'analyse
function kikkoHint(m){
  const p = m.prono;
  if(!p) return '<span class="bet-hint">Choisis ton score</span>';

  const hasElo = !!p.elo, hasFifa = !!p.fifa;
  const cols = (hasElo?1:0) + (hasFifa?1:0);

  // "Équipe · rang FIFA · Elo"
  const teamMeta = (t) => {
    const bits = [];
    if(t.rankLabel) bits.push(t.rankLabel + ' FIFA');
    bits.push(t.elo != null ? ('Elo ' + t.elo) : 'Elo n.d.');
    return '<span class="kp-team"><b>' + esc(t.name) + '</b>' +
           '<span class="kp-meta">' + bits.join(' · ') + '</span></span>';
  };

  // Tableau comparatif Elo / FIFA
  let head = '<span class="kp-gl"></span>';
  if(hasElo)  head += '<span class="kp-gh kp-elo">Elo</span>';
  if(hasFifa) head += '<span class="kp-gh">FIFA</span>';

  const rowFn = (label, eloV, fifaV) => {
    let s = '<span class="kp-gl">' + label + '</span>';
    if(hasElo)  s += '<span class="kp-gv">' + eloV + '</span>';
    if(hasFifa) s += '<span class="kp-gv">' + fifaV + '</span>';
    return s;
  };

  const grid = '<span class="kp-grid cols-' + cols + '">' +
      head +
      rowFn(esc(p.home.name), hasElo? p.elo.probHome+' %':'', hasFifa? p.fifa.probHome+' %':'') +
      rowFn('Match nul',       hasElo? p.elo.probDraw+' %':'', hasFifa? p.fifa.probDraw+' %':'') +
      rowFn(esc(p.away.name), hasElo? p.elo.probAway+' %':'', hasFifa? p.fifa.probAway+' %':'') +
      rowFn('Score',           hasElo?(p.elo.scoreHome+'-'+p.elo.scoreAway):'', hasFifa?(p.fifa.scoreHome+'-'+p.fifa.scoreAway):'') +
    '</span>';

  const note = hasElo ? '' :
    '<span class="kp-foot">Elo indisponible pour ce match (équipe sans note Elo).</span>';

  const pop = '<span class="kikko-pop" role="tooltip">' +
      '<span class="kp-head">Analyse de Kikko</span>' +
      teamMeta(p.home) + teamMeta(p.away) +
      '<span class="kp-div"></span>' +
      grid + note +
      '<span class="kp-foot">Elo : ' + esc(p.eloDate) + ' · FIFA : ' + esc(p.rankDate) + '</span>' +
    '</span>';

  return '<span class="bet-hint">' +
      'Prévision de victoire pour <b>' + esc(p.label) + '</b>. Choisis ton score ' +
      '<span class="kikko-i" tabindex="0" role="img" aria-label="Voir l\'analyse de Kikko">i' + pop + '</span>' +
    '</span>';
}

// Ligne pour un match À PARIER (avec sélecteur de buts)
function renderBetRow(m){
  const bet = MY_BETS[m.id] || {};
  const hasBet = bet.home != null && bet.away != null;   // pari déjà enregistré ?
  const badge = m.group ? (GROUP_LABELS[m.group]||m.group) : (STAGE_LABELS[m.stage]||'');
  return '<div class="bet-row" data-match="'+m.id+'">' +
    '<div class="m-meta"><span class="m-time">'+fmtDateTime(m.date)+'</span>'+(badge?'<span class="m-badge">'+esc(badge)+'</span>':'')+'<span class="m-countdown" data-kickoff="'+m.date+'"></span></div>' +
    '<div class="bet-body">' +
      '<div class="m-team home"'+teamAttr(m.home)+'>'+crest(m.homeCrest)+'<span>'+esc(m.home)+'</span></div>' +
      '<div class="bet-pick">' +
        goalPicker('home', bet.home) +
        '<span class="bet-sep">-</span>' +
        goalPicker('away', bet.away) +
      '</div>' +
      '<div class="m-team away"'+teamAttr(m.away)+'><span>'+esc(m.away)+'</span>'+crest(m.awayCrest)+'</div>' +
    '</div>' +
    '<div class="bet-actions">' +
      kikkoHint(m) +
      '<button class="btn btn-solid bet-save">' + (hasBet ? 'Modifier' : 'Valider') + '</button>' +
    '</div>' +
  '</div>';
}

// Ligne pour un match PASSÉ (résultat + mon prono + points)
function renderDoneRow(m){
  const bet = MY_BETS[m.id];
  const badge = m.group ? (GROUP_LABELS[m.group]||m.group) : (STAGE_LABELS[m.stage]||'');
  const hasScore = m.scoreHome!=null && m.scoreAway!=null;
  const finished = m.status==='FINISHED';
  const realScore = hasScore ? (m.scoreHome+' - '+m.scoreAway) : '… - …';
  const scoreLab = finished ? 'Score final' : 'En cours';
  const live = m.status==='IN_PLAY' || m.status==='PAUSED';

  let myProno = '<span class="dp-none">Pas de pari</span>';
  let ptsBadge = '';
  if(bet){
    myProno = 'Ton pari : <b>'+bet.home+' - '+bet.away+'</b>';
    if(bet.points!=null){
      const cls = bet.points===3 ? 'pts3' : (bet.points===1 ? 'pts1' : 'pts0');
      ptsBadge = '<span class="pts-badge '+cls+'">+'+bet.points+' pt'+(bet.points>1?'s':'')+'</span>';
    } else {
      ptsBadge = '<span class="pts-badge wait">en attente</span>';
    }
  }

  // Lien "Voir le résumé" : recherche YouTube pré-remplie (matchs terminés).
  let resumeLink = '';
  if(finished){
    const q = encodeURIComponent(m.home + ' ' + m.away + ' résumé Coupe du monde 2026');
    resumeLink = '<a class="m-resume" href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener noreferrer">▶ Voir le résumé</a>';
  }

  return '<div class="done-row">' +
    '<div class="m-meta"><span class="m-time">'+fmtDateTime(m.date)+'</span>'+(badge?'<span class="m-badge">'+esc(badge)+'</span>':'')+(live?'<span class="m-live">EN DIRECT</span>':'')+'</div>' +
    '<div class="m-body">' +
      '<div class="m-team home"'+teamAttr(m.home)+'>'+crest(m.homeCrest)+'<span>'+esc(m.home)+'</span></div>' +
      '<div class="m-center"><span class="m-score-lab">'+scoreLab+'</span><span class="m-score">'+realScore+'</span></div>' +
      '<div class="m-team away"'+teamAttr(m.away)+'><span>'+esc(m.away)+'</span>'+crest(m.awayCrest)+'</div>' +
    '</div>' +
    '<div class="done-foot">'+myProno+' '+ptsBadge+resumeLink+'</div>' +
  '</div>';
}

async function save(matchId, home, away, rowEl){
  const res = await fetch('/api/bets', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ matchId, home, away })
  });
  const data = await res.json().catch(()=>({}));
  if(res.ok){
    MY_BETS[matchId] = { home, away, points:null };
    if(rowEl){
      const b = rowEl.querySelector('.bet-save');
      if(b) b.textContent = 'Modifier';
    }
    showToast('Pronostic enregistré !', true);
  } else {
    showToast((data && data.error) || 'Erreur', false);
  }
}

// Met à jour l'affichage du chiffre et les ballons selon la liste
function refreshPicker(picker){
  const select = picker.querySelector('.goal-select');
  const num = picker.querySelector('.bet-num');
  const v = parseInt(select.value, 10);
  if (num) num.textContent = isNaN(v) ? '0' : v;
  picker.querySelectorAll('.ball').forEach((b)=>{
    const n = parseInt(b.dataset.n, 10);
    b.classList.toggle('active', !isNaN(v) && n <= v);
  });
}

function initPicker(picker){
  const select = picker.querySelector('.goal-select');
  picker.querySelectorAll('.ball').forEach((b)=>{
    b.addEventListener('click', ()=>{ select.value = b.dataset.n; refreshPicker(picker); });
  });
  select.addEventListener('change', ()=> refreshPicker(picker));
  refreshPicker(picker);
}

function bindRows(){
  document.querySelectorAll('.goal-picker').forEach(initPicker);
  document.querySelectorAll('.bet-row .bet-save').forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('.bet-row');
      const matchId = Number(row.dataset.match);
      const h = row.querySelector('.goal-select[data-side="home"]').value;
      const a = row.querySelector('.goal-select[data-side="away"]').value;
      if(h===''||a===''){ showToast('Choisis un score pour les deux équipes.', false); return; }
      save(matchId, parseInt(h,10), parseInt(a,10), row);
    });
  });
}

async function load(){
  const needLogin = document.getElementById('need-login');
  const state = document.getElementById('paris-state');

  let me=null;
  try{ me = await (await fetch('/api/me')).json(); }catch(e){}
  if(!me || !me.pseudo){ needLogin.hidden=false; return; }

  state.hidden=false;
  let matches=[], betsData={bets:{},totalPoints:0};
  try{
    matches = await (await fetch('/api/matches')).json();
    betsData = await (await fetch('/api/bets/me')).json();
  }catch(e){
    state.className='state error'; state.textContent="Impossible de charger les matchs."; return;
  }
  if(!Array.isArray(matches)){ state.className='state error'; state.textContent = matches.error || "Données indisponibles."; return; }

  MY_BETS = betsData.bets || {};
  state.hidden=true;

  // Points en haut
  const pb = document.getElementById('points-badge');
  document.getElementById('pb-num').textContent = betsData.totalPoints || 0;
  pb.hidden=false;

  const upcoming = matches.filter(isBettable).sort((a,b)=> new Date(a.date)-new Date(b.date));
  const done = matches.filter(m=> !isBettable(m) && (MY_BETS[m.id] || m.status==='FINISHED' || m.status==='IN_PLAY' || m.status==='PAUSED'))
                      .sort((a,b)=> new Date(b.date)-new Date(a.date));

  // Remplit les deux onglets (chacun a son message si vide)
  document.getElementById('upcoming').innerHTML = upcoming.map(renderBetRow).join('');
  document.getElementById('upcoming-empty').hidden = upcoming.length > 0;
  if(upcoming.length) bindRows();

  document.getElementById('done').innerHTML = done.map(renderDoneRow).join('');
  document.getElementById('done-empty').hidden = done.length > 0;

  document.getElementById('paris-tabs').hidden = false;
  showTab('upcoming');
  refreshCountdowns();
}

// Bascule entre "À pronostiquer" et "Mes paris passés"
function showTab(which){
  document.querySelectorAll('#paris-tabs .tab').forEach((b)=>{
    b.classList.toggle('is-active', b.dataset.ptab === which);
  });
  document.getElementById('section-upcoming').hidden = (which !== 'upcoming');
  document.getElementById('section-done').hidden = (which !== 'done');
}
document.querySelectorAll('#paris-tabs .tab').forEach((b)=>{
  b.addEventListener('click', ()=> showTab(b.dataset.ptab));
});

// --- Compte à rebours "plus que Xh pour parier" (matchs < 24h) ---
function refreshCountdowns(){
  const now = Date.now();
  document.querySelectorAll('.m-countdown').forEach((el)=>{
    const kickoff = new Date(el.dataset.kickoff).getTime();
    let diff = kickoff - now;
    el.classList.remove('cd-soon','cd-urgent','cd-over');

    if (diff <= 0){                      // coup d'envoi passé
      el.textContent = '⏳ trop tard';
      el.classList.add('cd-over');
      return;
    }
    if (diff > 24*3600*1000){            // plus de 24h : on n'affiche rien
      el.textContent = '';
      return;
    }
    const h = Math.floor(diff/3600000);
    const min = Math.floor((diff%3600000)/60000);
    let txt;
    if (h >= 1) txt = '⏳ plus que ' + h + 'h ' + String(min).padStart(2,'0') + 'min pour parier';
    else        txt = '⏳ plus que ' + min + 'min pour parier';
    el.textContent = txt;

    if (diff < 10*60*1000)      el.classList.add('cd-urgent'); // < 10 min
    else if (diff < 60*60*1000) el.classList.add('cd-soon');   // < 1h
  });
}
// Relance toutes les 30 s ; relancée aussi après chaque chargement de la liste.
setInterval(refreshCountdowns, 30000);

load();
