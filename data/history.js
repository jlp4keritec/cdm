// ============================================================
//  Coupe à la maison — historique du classement
//  But : garder une "photo" du classement pour afficher les
//  flèches d'évolution (montée / descente) sur le palmarès.
//  Une nouvelle photo est prise quand le classement change
//  (typiquement après chaque match terminé).
//  Stockage simple dans data/standings-history.json.
// ============================================================

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'standings-history.json');

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch (e) { return { previous: null, current: null }; }
}
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// Réduit un classement complet à l'essentiel : pseudo -> rang.
function snapshot(standings) {
  const map = {};
  (standings || []).forEach((s) => { map[s.pseudo] = s.rank; });
  return map;
}

// Signature simple pour détecter un changement de classement
// (ordre des pseudos + total de points).
function signature(standings) {
  return (standings || [])
    .map((s) => s.pseudo + ':' + s.points)
    .join('|');
}

// Met à jour l'historique si le classement a changé, puis renvoie
// la photo PRÉCÉDENTE (celle à laquelle on compare le classement actuel).
// - previous : photo d'avant le dernier changement (sert aux flèches)
// - current  : photo du classement courant + sa signature
function updateAndGetPrevious(standings) {
  const data = load();
  const sig = signature(standings);

  // Premier passage : on enregistre, pas encore de comparaison possible.
  if (!data.current) {
    data.current = { sig, ranks: snapshot(standings) };
    save(data);
    return null;
  }

  // Le classement a changé : l'ancien "current" devient "previous".
  if (data.current.sig !== sig) {
    data.previous = data.current;
    data.current = { sig, ranks: snapshot(standings) };
    save(data);
  }

  return data.previous ? data.previous.ranks : null;
}

module.exports = { updateAndGetPrevious };
