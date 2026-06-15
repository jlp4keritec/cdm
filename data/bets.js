// ============================================================
//  Coupe à la maison — paris (pronostics) & points
//  Règle de base : bon résultat = 1 point, score exact = 3 points.
//
//  Trois modes de pari par match (un seul à la fois) :
//   - 'normal' : la règle de base (1 ou 3 pts).
//   - 'qod'    : Quitte ou double. On mise des points :
//                score exact = +3 × mise, bon résultat = +1,5 × mise
//                (arrondi au point supérieur), perdu = − mise.
//   - 'joker'  : on mise 2 points et on gagne le nombre total de
//                buts du match (quel que soit le prono). Net = buts − 2.
//
//  Les points d'un mode misé REMPLACENT le 1 ou 3 pt normal du match.
//  Stockage simple dans data/bets.json.
// ============================================================

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'bets.json');

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch (e) { return []; }
}
function save(bets) {
  fs.writeFileSync(FILE, JSON.stringify(bets, null, 2));
}

// Tous les paris d'un utilisateur
function getUserBets(userId) {
  return load().filter((b) => b.userId === userId);
}

// Crée ou met à jour le pari d'un utilisateur pour un match.
// mode  : 'normal' (défaut), 'qod' ou 'joker'.
// stake : mise en points (0 pour le mode normal ; 2 imposé pour le joker).
function setBet(userId, matchId, home, away, mode, stake) {
  const all = load();
  const now = new Date().toISOString();
  const md = (mode === 'qod' || mode === 'joker') ? mode : 'normal';
  const st = (md === 'normal') ? 0 : Math.max(0, parseInt(stake, 10) || 0);
  const existing = all.find((b) => b.userId === userId && b.matchId === matchId);
  if (existing) {
    existing.home = home;
    existing.away = away;
    existing.mode = md;
    existing.stake = st;
    existing.updatedAt = now;
  } else {
    all.push({ userId, matchId, home, away, mode: md, stake: st, createdAt: now, updatedAt: now });
  }
  save(all);
  return true;
}

function allBets() { return load(); }

// Points d'un pari NORMAL face au score réel (null si le match n'est pas joué)
function pointsFor(predHome, predAway, scoreHome, scoreAway) {
  if (scoreHome == null || scoreAway == null) return null;
  if (predHome === scoreHome && predAway === scoreAway) return 3; // score exact
  const predSign = Math.sign(predHome - predAway);
  const realSign = Math.sign(scoreHome - scoreAway);
  if (predSign === realSign) return 1; // bon résultat (victoire/nul/défaite)
  return 0;
}

// Points d'un pari en tenant compte de son mode.
//   bet : { home, away, mode, stake }
//   m   : le match, avec m.scoreHome / m.scoreAway (null si pas joué)
// Renvoie null tant que le match n'est pas joué.
function gamePointsFor(bet, m) {
  if (!m) return null;
  const sh = m.scoreHome, sa = m.scoreAway;
  const mode = (bet && bet.mode) || 'normal';
  const stake = (bet && bet.stake) || 0;

  // JOKER : on gagne le nombre de buts du match, moins la mise.
  if (mode === 'joker') {
    if (sh == null || sa == null) return null;
    return (sh + sa) - stake;             // ex. 3-2 = 5 buts, mise 2 → +3
  }

  // QUITTE OU DOUBLE : multiplicateur sur la mise selon le résultat.
  if (mode === 'qod') {
    const base = pointsFor(bet.home, bet.away, sh, sa); // 3 / 1 / 0 / null
    if (base == null) return null;
    if (base === 3) return 3 * stake;              // score exact → ×3
    if (base === 1) return Math.ceil(1.5 * stake); // bon résultat → ×1,5 (arrondi sup.)
    return -stake;                                 // perdu → on perd la mise
  }

  // NORMAL : règle de base.
  return pointsFor(bet.home, bet.away, sh, sa);
}

module.exports = { getUserBets, setBet, allBets, pointsFor, gamePointsFor };
