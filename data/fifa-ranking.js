// ============================================================
//  Coupe à la maison — Classement mondial FIFA
//  Source : FIFA/Coca-Cola Men's World Ranking — 1er avril 2026
//  (même classement que celui affiché sur fifa.com)
//  Prochaine mise à jour officielle : 11 juin 2026.
//  Clés = noms français (voir teams-fr.js).
// ============================================================

const RANK_DATE = '1er avril 2026';

const RANK = {
  'France': 1, 'Espagne': 2, 'Argentine': 3, 'Angleterre': 4, 'Portugal': 5,
  'Brésil': 6, 'Pays-Bas': 7, 'Maroc': 8, 'Belgique': 9, 'Allemagne': 10,
  'Croatie': 11, 'Italie': 12, 'Colombie': 13, 'Sénégal': 14, 'Mexique': 15,
  'États-Unis': 16, 'Uruguay': 17, 'Japon': 18, 'Suisse': 19, 'Danemark': 20,
  'Iran': 21, 'Turquie': 22, 'Équateur': 23, 'Autriche': 24, 'Corée du Sud': 25,
  'Nigéria': 26, 'Australie': 27, 'Algérie': 28, 'Égypte': 29, 'Canada': 30,
  'Norvège': 31, 'Ukraine': 32, 'Panama': 33, "Côte d'Ivoire": 34, 'Pologne': 35,
  'Russie': 36, 'Pays de Galles': 37, 'Suède': 38, 'Serbie': 39, 'Paraguay': 40,
  'Tchéquie': 41, 'Hongrie': 42, 'Écosse': 43, 'Tunisie': 44, 'Cameroun': 45,
  'RD Congo': 46, 'Grèce': 47, 'Slovaquie': 48, 'Venezuela': 49, 'Ouzbékistan': 50,
  'Costa Rica': 51, 'Mali': 52, 'Pérou': 53, 'Chili': 54, 'Qatar': 55,
  'Roumanie': 56, 'Irak': 57, 'Slovénie': 58, 'Irlande': 59, 'Afrique du Sud': 60,
  'Arabie saoudite': 61, 'Burkina Faso': 62, 'Jordanie': 63, 'Albanie': 64,
  'Bosnie-Herzégovine': 65, 'Honduras': 66, 'Macédoine du Nord': 67,
  'Émirats arabes unis': 68, 'Cap-Vert': 69, 'Irlande du Nord': 70, 'Jamaïque': 71,
  'Géorgie': 72, 'Finlande': 73, 'Ghana': 74, 'Islande': 75, 'Curaçao': 82,
  'Haïti': 83, 'Nouvelle-Zélande': 85
};

function rankFor(name) {
  return RANK[name] || null;
}

module.exports = { rankFor, RANK_DATE };
