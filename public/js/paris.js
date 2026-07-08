// ============================================================
//  Coupe à la maison — page Pronostics (paris)
//  Modes par match : normal · quitte ou double (🎲) · joker (🃏)
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

let MY_BETS = {};      // matchId -> {home, away, points, mode, stake}
let HAS_UPCOMING = false;
let AVAILABLE = 0;     // portefeuille : points disponibles à miser

function isBettable(m){
  if(!m) return false;
  if(m.home==='À déterminer' || m.away==='À déterminer') return false;
  const notStarted = m.status==='SCHEDULED' || m.status==='TIMED';
  return notStarted && new Date(m.date) > new Date();
}

function fmtDateTime(d){
  return new Date(d).toLocaleString('fr-FR',{timeZone:'Europe/Paris',weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
}

// --- Portefeuille : combien ce match peut remettre en jeu ---
// On rembourse la mise déjà posée sur CE match (cas d'une modification).
function refundFor(matchId){
  const b = MY_BETS[matchId];
  return (b && (b.mode==='qod'||b.mode==='joker')) ? (b.stake||0) : 0;
}
function maxStakeFor(matchId){ return Math.max(0, AVAILABLE + refundFor(matchId)); }

// Aperçu des gains/pertes possibles pour une mise (quitte ou double)
function qodHint(stakeRaw){
  const s = Math.max(0, parseInt(stakeRaw,10)||0);
  const exact = 3*s, res = Math.ceil(1.5*s);
  return 'Si score exact : <b>+'+exact+'</b> · bon résultat : <b>+'+res+'</b> · perdu : <b>−'+s+'</b>';
}

// Sélecteur de buts : liste (0 à 15) + ballons (1 à 5) + grand chiffre
function goalPicker(side, val){
  const v = (val != null) ? val : 0;
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

// Phrase "Kikko pronostique ..." + bulle d'analyse (inchangée)
function kikkoHint(m){
  const p = m.prono;
  if(!p) return '<span class="bet-hint">Choisis ton score</span>';

  const hasElo = !!p.elo, hasFifa = !!p.fifa;
  const cols = (hasElo?1:0) + (hasFifa?1:0);

  const teamMeta = (t) => {
    const bits = [];
    if(t.rankLabel) bits.push(t.rankLabel + ' FIFA');
    bits.push(t.elo != null ? ('Elo ' + t.elo) : 'Elo n.d.');
    return '<span class="kp-team"><b>' + esc(t.name) + '</b>' +
           '<span class="kp-meta">' + bits.join(' · ') + '</span></span>';
  };

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

// Ligne pour un match À PARIER (avec choix du mode)
function renderBetRow(m){
  const bet = MY_BETS[m.id] || {};
  const has = !!MY_BETS[m.id];
  const mode = bet.mode || 'normal';
  const maxS = maxStakeFor(m.id);
  const qodDis = maxS < 1;
  const jokerDis = maxS < 2;
  const stakeVal = (mode==='qod' && bet.stake) ? bet.stake : 1;
  const badge = m.group ? (GROUP_LABELS[m.group]||m.group) : (STAGE_LABELS[m.stage]||'');

  const modeBtn = (md, lab, dis, why) =>
    '<button type="button" class="mode-opt'+(mode===md?' is-active':'')+'" data-mode="'+md+'"'+
    (dis?' disabled title="'+why+'"':'')+'>'+lab+'</button>';

  return '<div class="bet-row" data-match="'+m.id+'" data-mode="'+mode+'">' +
    '<div class="m-meta"><span class="m-time">'+fmtDateTime(m.date)+'</span>'+(badge?'<span class="m-badge">'+esc(badge)+'</span>':'')+'<span class="m-countdown" data-kickoff="'+m.date+'"></span></div>' +

    '<div class="mode-pick" role="group" aria-label="Type de pari">' +
      modeBtn('normal','Prono normal', false, '') +
      modeBtn('qod','🎲 Quitte ou double', qodDis, 'Pas assez de points pour ce mode') +
      modeBtn('joker','🃏 Joker', jokerDis, 'Il te faut au moins 2 points') +
    '</div>' +

    '<div class="bet-body">' +
      '<div class="m-team home"'+teamAttr(m.home)+'>'+crest(m.homeCrest)+'<span>'+esc(m.home)+'</span></div>' +
      '<div class="bet-mid">' +
        '<div class="bet-pick"'+(mode==='joker'?' hidden':'')+'>' +
          goalPicker('home', bet.home) +
          '<span class="bet-sep">-</span>' +
          goalPicker('away', bet.away) +
        '</div>' +
        '<div class="bet-joker-mid"'+(mode==='joker'?'':' hidden')+'>🃏</div>' +
      '</div>' +
      '<div class="m-team away"'+teamAttr(m.away)+'><span>'+esc(m.away)+'</span>'+crest(m.awayCrest)+'</div>' +
    '</div>' +

    // Zone mise (quitte ou double)
    '<div class="stake-zone"'+(mode==='qod'?'':' hidden')+'>' +
      '<label class="stake-lab">Ta mise : ' +
        '<input type="number" class="stake-input" min="1" max="'+maxS+'" value="'+stakeVal+'" inputmode="numeric" /> pts</label> ' +
      '<span class="stake-max">(max '+maxS+')</span>' +
      '<div class="stake-hint">'+qodHint(stakeVal)+'</div>' +
    '</div>' +

    // Note joker
    '<div class="joker-note"'+(mode==='joker'?'':' hidden')+'>' +
      '🃏 Tu mises <b>2 points</b> et tu gagnes le <b>nombre de buts</b> du match (peu importe ton prono). Un 0-0 te coûte 2 pts.' +
    '</div>' +

    '<div class="bet-actions">' +
      kikkoHint(m) +
      '<div class="bet-btns">' +
        '<button class="btn btn-ghost bet-rand" type="button" title="Tirer un score au hasard selon le niveau des équipes"'+(mode!=='normal'?' hidden':'')+'>🎲 Au hasard</button>' +
        '<button class="btn btn-solid bet-save">' + (has ? 'Modifier' : 'Valider') + '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// Ligne pour un match PASSÉ (résultat + mon pari + points)
function renderDoneRow(m){
  const bet = MY_BETS[m.id];
  const badge = m.group ? (GROUP_LABELS[m.group]||m.group) : (STAGE_LABELS[m.stage]||'');
  const hasScore = m.scoreHome!=null && m.scoreAway!=null;
  const finished = m.status==='FINISHED';
  const realScore = hasScore ? (m.scoreHome+' - '+m.scoreAway) : '… - …';
  const scoreLab = finished ? 'Score final' : 'En cours';
  const hasPens = m.pensHome!=null && m.pensAway!=null;
  const pensTxt = hasPens ? ('t.a.b. '+m.pensHome+' - '+m.pensAway) : '';
  const live = m.status==='IN_PLAY' || m.status==='PAUSED';

  let myProno = '<span class="dp-none">Pas de pari</span>';
  let ptsBadge = '';
  if(bet){
    const mode = bet.mode || 'normal';
    if(mode==='joker'){
      myProno = 'Ton pari : <b>🃏 Joker</b> <span class="mode-tag joker">mise 2 pts</span>';
    } else if(mode==='qod'){
      myProno = 'Ton pari : <b>'+bet.home+' - '+bet.away+'</b> <span class="mode-tag qod">🎲 Quitte ou double · mise '+(bet.stake||0)+'</span>';
    } else {
      myProno = 'Ton pari : <b>'+bet.home+' - '+bet.away+'</b>';
    }
    if(bet.points!=null){
      const p = bet.points;
      let cls, txt;
      if(p>0){ cls='ptswin'; txt='+'+p+' pt'+(p>1?'s':''); }
      else if(p<0){ const ap=Math.abs(p); cls='ptsloss'; txt='−'+ap+' pt'+(ap>1?'s':''); }
      else { cls='pts0'; txt='0 pt'; }
      ptsBadge = '<span class="pts-badge '+cls+'">'+txt+'</span>';
    } else {
      ptsBadge = '<span class="pts-badge wait">en attente</span>';
    }
  }

  let resumeLink = '';
  if(finished){
    const q = encodeURIComponent(m.home + ' ' + m.away + ' résumé Coupe du monde 2026');
    resumeLink = '<a class="m-resume" href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener noreferrer">▶ Voir le résumé</a>';
  }

  return '<div class="done-row">' +
    '<div class="m-meta"><span class="m-time">'+fmtDateTime(m.date)+'</span>'+(badge?'<span class="m-badge">'+esc(badge)+'</span>':'')+(live?'<span class="m-live">EN DIRECT</span>':'')+'</div>' +
    '<div class="m-body">' +
      '<div class="m-team home"'+teamAttr(m.home)+'>'+crest(m.homeCrest)+'<span>'+esc(m.home)+'</span></div>' +
      '<div class="m-center"><span class="m-score-lab">'+scoreLab+'</span><span class="m-score">'+realScore+'</span>'+(hasPens?'<span class="m-pens">'+pensTxt+'</span>':'')+'</div>' +
      '<div class="m-team away"'+teamAttr(m.away)+'><span>'+esc(m.away)+'</span>'+crest(m.awayCrest)+'</div>' +
    '</div>' +
    '<div class="done-foot">'+myProno+' '+ptsBadge+resumeLink+'</div>' +
  '</div>';
}

// Bascule visuelle du mode sur une ligne
function applyMode(row, md){
  row.dataset.mode = md;
  row.querySelectorAll('.mode-opt').forEach((b)=> b.classList.toggle('is-active', b.dataset.mode===md));
  const pick = row.querySelector('.bet-pick');
  const jmid = row.querySelector('.bet-joker-mid');
  const stake = row.querySelector('.stake-zone');
  const jnote = row.querySelector('.joker-note');
  const rand = row.querySelector('.bet-rand');
  if(pick)  pick.hidden  = (md==='joker');
  if(jmid)  jmid.hidden  = (md!=='joker');
  if(stake) stake.hidden = (md!=='qod');
  if(jnote) jnote.hidden = (md!=='joker');
  if(rand)  rand.hidden  = (md!=='normal');
}

// Envoi d'un pari (tous modes). payload : { mode, home, away, stake }
async function save(matchId, payload, rowEl){
  const res = await fetch('/api/bets', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(Object.assign({ matchId }, payload))
  });
  const data = await res.json().catch(()=>({}));
  if(res.ok){
    MY_BETS[matchId] = { home:payload.home, away:payload.away, points:null, mode:payload.mode, stake:payload.stake||0 };
    if(rowEl){
      const b = rowEl.querySelector('.bet-save');
      if(b) b.textContent = 'Modifier';
    }
    const msg = payload.mode==='joker' ? 'Joker enregistré (mise 2 pts) !'
              : payload.mode==='qod'   ? ('Quitte ou double enregistré (mise '+payload.stake+' pts) !')
              :                          'Pronostic enregistré !';
    showToast(msg, true);
    await refreshWallet();
  } else {
    showToast((data && data.error) || 'Erreur', false);
  }
}

// Clic sur "Valider / Modifier" : lit le mode et envoie le bon pari
function onSave(row){
  const matchId = Number(row.dataset.match);
  const mode = row.dataset.mode || 'normal';

  if(mode==='joker'){
    if(maxStakeFor(matchId) < 2){ showToast('Il te faut au moins 2 points pour jouer le Joker.', false); return; }
    save(matchId, { mode:'joker', home:0, away:0, stake:2 }, row);
    return;
  }

  const h = row.querySelector('.goal-select[data-side="home"]').value;
  const a = row.querySelector('.goal-select[data-side="away"]').value;
  if(h===''||a===''){ showToast('Choisis un score pour les deux équipes.', false); return; }
  const home = parseInt(h,10), away = parseInt(a,10);

  if(mode==='qod'){
    const max = maxStakeFor(matchId);
    const stake = parseInt(row.querySelector('.stake-input').value,10);
    if(isNaN(stake) || stake < 1){ showToast('Indique ta mise (au moins 1 point).', false); return; }
    if(stake > max){ showToast('Tu peux miser au maximum '+max+' pt'+(max>1?'s':'')+'.', false); return; }
    save(matchId, { mode:'qod', home, away, stake }, row);
  } else {
    save(matchId, { mode:'normal', home, away, stake:0 }, row);
  }
}

// Applique un score à une ligne (sélecteurs + pari) ; le hasard = mode normal
function applyScoreToRow(row, home, away){
  if(!row) return;
  ['home','away'].forEach((side)=>{
    const sel = row.querySelector('.goal-select[data-side="'+side+'"]');
    if(sel){ sel.value = String(side==='home'?home:away); refreshPicker(sel.closest('.goal-picker')); }
  });
  const matchId = Number(row.dataset.match);
  MY_BETS[matchId] = { home, away, points:null, mode:'normal', stake:0 };
  applyMode(row, 'normal');
  const b = row.querySelector('.bet-save');
  if(b) b.textContent = 'Modifier';
}

// 🎲 Tire un score au hasard pour UN match (mode normal), et l'enregistre.
async function randomOne(row){
  const matchId = Number(row.dataset.match);
  const btn = row.querySelector('.bet-rand');
  if(btn) btn.disabled = true;
  try{
    const res = await fetch('/api/bets/random', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ matchId })
    });
    const data = await res.json().catch(()=>({}));
    if(res.ok && data.results && data.results[0]){
      const r = data.results[0];
      applyScoreToRow(row, r.home, r.away);
      showToast('Pari au hasard : '+r.home+' - '+r.away+' (enregistré)', true);
      await refreshWallet();
    } else {
      showToast((data && data.error) || 'Erreur', false);
    }
  } finally {
    if(btn) btn.disabled = false;
  }
}

// 🎲 Tire un score au hasard pour TOUS les matchs à venir SANS mise, et les enregistre.
async function randomAll(){
  const btn = document.getElementById('rand-all');
  if(btn) btn.disabled = true;
  try{
    const res = await fetch('/api/bets/random', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({})
    });
    const data = await res.json().catch(()=>({}));
    if(res.ok && Array.isArray(data.results)){
      data.results.forEach((r)=>{
        const row = document.querySelector('.bet-row[data-match="'+r.matchId+'"]');
        applyScoreToRow(row, r.home, r.away);
      });
      const n = data.count || data.results.length;
      showToast(n+' pari'+(n>1?'s':'')+' tiré'+(n>1?'s':'')+' au hasard et enregistré'+(n>1?'s':'')+' !', true);
      await refreshWallet();
    } else {
      showToast((data && data.error) || 'Erreur', false);
    }
  } finally {
    if(btn) btn.disabled = false;
  }
}

// Met à jour l'affichage du chiffre et les ballons
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

// Recalcule les limites de mise d'une ligne après un changement de portefeuille
function updateRowLimits(row){
  const matchId = Number(row.dataset.match);
  const max = maxStakeFor(matchId);
  const inp = row.querySelector('.stake-input');
  if(inp){
    inp.max = max;
    if((parseInt(inp.value,10)||0) > max) inp.value = (max>0?max:1);
    const hint = row.querySelector('.stake-hint');
    if(hint) hint.innerHTML = qodHint(inp.value);
  }
  const sm = row.querySelector('.stake-max');
  if(sm) sm.textContent = '(max '+max+')';
  const qodB = row.querySelector('.mode-opt[data-mode="qod"]');
  const jokB = row.querySelector('.mode-opt[data-mode="joker"]');
  if(qodB){ qodB.disabled = max < 1; if(max>=1) qodB.removeAttribute('title'); else qodB.title='Pas assez de points pour ce mode'; }
  if(jokB){ jokB.disabled = max < 2; if(max>=2) jokB.removeAttribute('title'); else jokB.title='Il te faut au moins 2 points'; }
  const cur = row.dataset.mode;
  if((cur==='qod' && max<1) || (cur==='joker' && max<2)) applyMode(row, 'normal');
}

// Recharge le portefeuille (points + disponible) et met à jour l'affichage
async function refreshWallet(){
  try{
    const d = await (await fetch('/api/bets/me')).json();
    if(!d) return;
    if(d.bets) MY_BETS = d.bets;
    AVAILABLE = d.available || 0;
    const pbn = document.getElementById('pb-num');
    const pba = document.getElementById('pb-avail');
    if(pbn) pbn.textContent = d.totalPoints || 0;
    if(pba) pba.textContent = AVAILABLE;
    document.querySelectorAll('.bet-row').forEach(updateRowLimits);
  }catch(e){}
}

function bindRows(){
  document.querySelectorAll('.goal-picker').forEach(initPicker);
  document.querySelectorAll('.bet-row').forEach((row)=>{
    row.querySelectorAll('.mode-opt').forEach((btn)=>{
      btn.addEventListener('click', ()=>{ if(btn.disabled) return; applyMode(row, btn.dataset.mode); });
    });
    const stakeInp = row.querySelector('.stake-input');
    if(stakeInp){
      stakeInp.addEventListener('input', ()=>{
        const hint = row.querySelector('.stake-hint');
        if(hint) hint.innerHTML = qodHint(stakeInp.value);
      });
    }
    const rand = row.querySelector('.bet-rand');
    if(rand) rand.addEventListener('click', ()=> randomOne(row));
    const saveBtn = row.querySelector('.bet-save');
    if(saveBtn) saveBtn.addEventListener('click', ()=> onSave(row));
  });
}

async function load(){
  const needLogin = document.getElementById('need-login');
  const state = document.getElementById('paris-state');

  let me=null;
  try{ me = await (await fetch('/api/me')).json(); }catch(e){}
  if(!me || !me.pseudo){ needLogin.hidden=false; return; }

  state.hidden=false;
  let matches=[], betsData={bets:{},totalPoints:0,available:0};
  try{
    matches = await (await fetch('/api/matches')).json();
    betsData = await (await fetch('/api/bets/me')).json();
  }catch(e){
    state.className='state error'; state.textContent="Impossible de charger les matchs."; return;
  }
  if(!Array.isArray(matches)){ state.className='state error'; state.textContent = matches.error || "Données indisponibles."; return; }

  MY_BETS = betsData.bets || {};
  AVAILABLE = betsData.available || 0;
  state.hidden=true;

  // Portefeuille en haut : total + disponible à miser
  const pb = document.getElementById('points-badge');
  document.getElementById('pb-num').textContent = betsData.totalPoints || 0;
  const pba = document.getElementById('pb-avail');
  if(pba) pba.textContent = AVAILABLE;
  pb.hidden=false;

  const upcoming = matches.filter(isBettable).sort((a,b)=> new Date(a.date)-new Date(b.date));
  const done = matches.filter(m=> !isBettable(m) && (MY_BETS[m.id] || m.status==='FINISHED' || m.status==='IN_PLAY' || m.status==='PAUSED'))
                      .sort((a,b)=> new Date(b.date)-new Date(a.date));

  document.getElementById('upcoming').innerHTML = upcoming.map(renderBetRow).join('');
  document.getElementById('upcoming-empty').hidden = upcoming.length > 0;
  if(upcoming.length) bindRows();

  HAS_UPCOMING = upcoming.length > 0;
  const randAllBtn = document.getElementById('rand-all');
  if(randAllBtn) randAllBtn.onclick = randomAll;

  document.getElementById('done').innerHTML = done.map(renderDoneRow).join('');
  document.getElementById('done-empty').hidden = done.length > 0;

  document.getElementById('paris-toolbar').hidden = false;
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
  const rb = document.getElementById('rand-all');
  if(rb) rb.hidden = (which !== 'upcoming') || !HAS_UPCOMING;
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

    if (diff <= 0){
      el.textContent = '⏳ trop tard';
      el.classList.add('cd-over');
      return;
    }
    if (diff > 24*3600*1000){
      el.textContent = '';
      return;
    }
    const h = Math.floor(diff/3600000);
    const min = Math.floor((diff%3600000)/60000);
    let txt;
    if (h >= 1) txt = '⏳ plus que ' + h + 'h ' + String(min).padStart(2,'0') + 'min pour parier';
    else        txt = '⏳ plus que ' + min + 'min pour parier';
    el.textContent = txt;

    if (diff < 10*60*1000)      el.classList.add('cd-urgent');
    else if (diff < 60*60*1000) el.classList.add('cd-soon');
  });
}
setInterval(refreshCountdowns, 30000);

load();
