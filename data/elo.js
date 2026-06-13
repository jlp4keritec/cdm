// ============================================================
//  Coupe à la maison — Notes Elo des sélections
//  Source : World Football Elo Ratings (eloratings.net),
//  relevé via footballratings.org le 7 juin 2026.
//  L'Elo tient compte de l'adversaire, de l'écart de buts et de
//  l'importance du match : c'est un meilleur indicateur de force
//  que le simple rang FIFA.
//  Clés = noms français (voir teams-fr.js).
//  Note : liste partielle. Les équipes absentes (ex. pays hôtes,
//  chargés en JavaScript et non récupérables automatiquement)
//  utilisent le classement FIFA en attendant leur Elo.
// ============================================================

const ELO_DATE = '7 juin 2026';

const ELO = {
  'Espagne': 2155,
  'Argentine': 2114,
  'France': 2062,
  'Angleterre': 2021,
  'Brésil': 1991,
  'Portugal': 1986,
  'Colombie': 1977,
  'Pays-Bas': 1944,
  'Équateur': 1935,
  'Allemagne': 1932,
  'Norvège': 1917,
  'Turquie': 1911,
  'Croatie': 1908,
  'Sénégal': 1867,
  'Italie': 1859,
  'Maroc': 1824,
  'Écosse': 1782,
  'Iran': 1772,
  'Ouzbékistan': 1718,
  'Jordanie': 1685,
  'RD Congo': 1655,
  'Irak': 1618,
  'Arabie saoudite': 1569,
  'Ghana': 1510
};

function eloFor(name) {
  return ELO[name] || null;
}

module.exports = { eloFor, ELO_DATE };
