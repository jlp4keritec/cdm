// ============================================================
//  Coupe à la maison — page Tableau de bord
// ============================================================

async function load(){
  const needLogin = document.getElementById('need-login');
  const state = document.getElementById('dash-state');
  const dash = document.getElementById('dash');

  const res = await fetch('/api/dashboard');
  if (res.status === 401){
    state.hidden = true;
    needLogin.hidden = false;
    return;
  }
  let d;
  try { d = await res.json(); }
  catch (e) { state.className='state error'; state.textContent='Impossible de charger ton tableau de bord.'; return; }

  document.getElementById('dash-hello').textContent = 'Salut ' + d.pseudo + ' 👋';
  document.getElementById('d-points').textContent = d.points;
  document.getElementById('d-placed').textContent = d.placed;
  document.getElementById('d-exact').textContent = d.exact;
  document.getElementById('d-correct').textContent = d.correct;

  if (d.rank){
    document.getElementById('d-rank').textContent = d.rank + 'ᵉ';
    document.getElementById('d-rank-lab').textContent = 'sur ' + d.totalPlayers + ' joueur' + (d.totalPlayers>1?'s':'');
  } else {
    document.getElementById('d-rank').textContent = '–';
    document.getElementById('d-rank-lab').textContent = 'pas encore classé';
  }

  state.hidden = true;
  dash.hidden = false;
}

load();
