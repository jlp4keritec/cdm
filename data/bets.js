// ============================================================
//  Coupe à la maison — paris (pronostics) & points
//  Règle : bon résultat = 1 point, score exact = 3 points.
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

// Crée ou met à jour le pari d'un utilisateur pour un match
function setBet(userId, matchId, home, away) {
  const all = load();
  const now = new Date().toISOString();
  const existing = all.find((b) => b.userId === userId && b.matchId === matchId);
  if (existing) {
    existing.home = home;
    existing.away = away;
    existing.updatedAt = now;
  } else {
    all.push({ userId, matchId, home, away, createdAt: now, updatedAt: now });
  }
  save(all);
  return true;
}

function allBets() { return load(); }

// Points d'un pari face au score réel (null si le match n'est pas joué)
function pointsFor(predHome, predAway, scoreHome, scoreAway) {
  if (scoreHome == null || scoreAway == null) return null;
  if (predHome === scoreHome && predAway === scoreAway) return 3; // score exact
  const predSign = Math.sign(predHome - predAway);
  const realSign = Math.sign(scoreHome - scoreAway);
  if (predSign === realSign) return 1; // bon résultat (victoire/nul/défaite)
  return 0;
}

module.exports = { getUserBets, setBet, allBets, pointsFor };
