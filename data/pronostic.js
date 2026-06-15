// ============================================================
//  Coupe à la maison — Pronostic "Kikko"
//  Calcule DEUX pronostics quand c'est possible :
//   - un basé sur l'Elo (si les deux équipes ont une note Elo) ;
//   - un basé sur le classement FIFA (si les deux ont un rang).
//  La bulle d'analyse affiche les deux côte à côte + les deux
//  classements (FIFA et Elo) de chaque équipe.
//  Terrain neutre (pas d'avantage à domicile en Coupe du monde).
// ============================================================

const { rankFor, RANK_DATE } = require('./fifa-ranking');
const { eloFor, ELO_DATE } = require('./elo');

// Rang FIFA -> "force" approchée (échelle proche de l'Elo).
function ratingFromRank(rank) {
  return 2000 - 11 * (rank - 1);
}

function ordinalFr(n) {
  return n === 1 ? '1ʳᵉ' : n + 'ᵉ';
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

// Calcule un pronostic (probas + score probable) à partir de deux "forces".
function predict(ratH, ratA) {
  const d = ratH - ratA;                       // >0 : home plus fort
  const E = 1 / (1 + Math.pow(10, -d / 400));  // proba (type Elo) que home gagne

  const pDraw = clamp(0.28 - 0.22 * Math.abs(2 * E - 1), 0.05, 0.30);
  const rest = 1 - pDraw;

  const TOTAL = 2.6;                            // ~2,6 buts répartis selon la force
  return {
    probHome: Math.round(rest * E * 100),
    probDraw: Math.round(pDraw * 100),
    probAway: Math.round(rest * (1 - E) * 100),
    scoreHome: clamp(Math.round(TOTAL * E), 0, 5),
    scoreAway: clamp(Math.round(TOTAL * (1 - E)), 0, 5)
  };
}

// Libellé court "Kikko pronostique ..." à partir d'un pronostic.
function labelFrom(pred, home, away) {
  const close = Math.abs(pred.probHome - pred.probAway) <= 8;
  if (pred.probDraw >= pred.probHome && pred.probDraw >= pred.probAway) {
    return { favorite: null, label: 'un match nul probable' };
  }
  const homeFav = pred.probHome >= pred.probAway;
  const fav = homeFav ? home : away;
  const favPct = homeFav ? pred.probHome : pred.probAway;
  return {
    favorite: fav,
    label: close ? 'un match serré (' + fav + ' ' + favPct + ' %)' : fav + ' (' + favPct + ' %)'
  };
}

// Pronostic complet d'un match (Elo + FIFA).
// Renvoie null si on ne peut rien calculer.
function pronoFor(home, away) {
  if (!home || !away) return null;
  if (home === 'À déterminer' || away === 'À déterminer') return null;

  const eloH = eloFor(home);
  const eloA = eloFor(away);
  const rH = rankFor(home);
  const rA = rankFor(away);

  const elo  = (eloH != null && eloA != null) ? predict(eloH, eloA) : null;
  const fifa = (rH  != null && rA  != null) ? predict(ratingFromRank(rH), ratingFromRank(rA)) : null;
  if (!elo && !fifa) return null;

  // Le libellé de la phrase s'appuie sur l'Elo si dispo, sinon FIFA.
  const primary = elo ? 'elo' : 'fifa';
  const lab = labelFrom(elo || fifa, home, away);

  return {
    favorite: lab.favorite,
    label: lab.label,
    primary,
    eloDate: ELO_DATE,
    rankDate: RANK_DATE,
    home: { name: home, rank: rH, rankLabel: rH ? ordinalFr(rH) : null, elo: eloH },
    away: { name: away, rank: rA, rankLabel: rA ? ordinalFr(rA) : null, elo: eloA },
    elo,
    fifa
  };
}

// ============================================================
//  Tirage d'un score "au hasard mais réaliste"
//  Le hasard est pondéré par la force des équipes :
//   - Elo si les deux équipes en ont une note ;
//   - sinon le rang FIFA (converti en force) ;
//   - sinon une force neutre par défaut.
//  Plus l'écart de niveau est grand, plus le favori peut marquer
//  (jusqu'à 15 buts dans les cas extrêmes, comme dans la vraie vie).
// ============================================================

// Force de chaque équipe (Elo de préférence, sinon FIFA, sinon neutre).
function ratingsFor(home, away) {
  const eloH = eloFor(home), eloA = eloFor(away);
  if (eloH != null && eloA != null) return { rH: eloH, rA: eloA };
  const rkH = rankFor(home), rkA = rankFor(away);
  const rH = (rkH != null) ? ratingFromRank(rkH) : 1700; // force neutre par défaut
  const rA = (rkA != null) ? ratingFromRank(rkA) : 1700;
  return { rH, rA };
}

// Tirage d'un nombre de buts suivant une loi de Poisson (méthode de Knuth).
// "lambda" = nombre de buts attendu pour l'équipe.
function poisson(lambda) {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// Tire un score aléatoire pondéré par le niveau. Renvoie { home, away }.
function randomScoreFor(home, away) {
  const { rH, rA } = ratingsFor(home, away);
  const diff = rH - rA;
  const E = 1 / (1 + Math.pow(10, -diff / 400));   // proba que "home" gagne
  const mismatch = Math.abs(2 * E - 1);            // 0 = équilibré, 1 = écrasant

  // Plus l'écart est grand, plus il y a de buts au total (le favori s'envole).
  const total = 2.3 + 6.5 * Math.pow(mismatch, 1.5); // ~2,3 (serré) → ~8,8 (énorme)

  const h = clamp(poisson(total * E),       0, 15);
  const a = clamp(poisson(total * (1 - E)), 0, 15);
  return { home: h, away: a };
}

module.exports = { pronoFor, randomScoreFor };
