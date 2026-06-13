// ============================================================
//  Coupe à la maison — noms d'équipes en français
// ============================================================

const FR = {
  // Hôtes & Amériques
  'United States': 'États-Unis', 'USA': 'États-Unis',
  'Canada': 'Canada', 'Mexico': 'Mexique',
  'Brazil': 'Brésil', 'Argentina': 'Argentine', 'Uruguay': 'Uruguay',
  'Colombia': 'Colombie', 'Ecuador': 'Équateur', 'Paraguay': 'Paraguay',
  'Chile': 'Chili', 'Peru': 'Pérou', 'Bolivia': 'Bolivie', 'Venezuela': 'Venezuela',
  'Costa Rica': 'Costa Rica', 'Panama': 'Panama', 'Honduras': 'Honduras',
  'Jamaica': 'Jamaïque', 'Haiti': 'Haïti', 'Trinidad and Tobago': 'Trinité-et-Tobago',
  'Curaçao': 'Curaçao', 'Suriname': 'Suriname', 'Guatemala': 'Guatemala',
  'El Salvador': 'Salvador',

  // Europe
  'France': 'France', 'Germany': 'Allemagne', 'Spain': 'Espagne',
  'England': 'Angleterre', 'Portugal': 'Portugal', 'Netherlands': 'Pays-Bas',
  'Belgium': 'Belgique', 'Italy': 'Italie', 'Croatia': 'Croatie',
  'Switzerland': 'Suisse', 'Denmark': 'Danemark', 'Poland': 'Pologne',
  'Serbia': 'Serbie', 'Wales': 'Pays de Galles', 'Scotland': 'Écosse',
  'Austria': 'Autriche', 'Sweden': 'Suède', 'Norway': 'Norvège',
  'Czechia': 'Tchéquie', 'Czech Republic': 'Tchéquie', 'Ukraine': 'Ukraine',
  'Turkey': 'Turquie', 'Türkiye': 'Turquie', 'Greece': 'Grèce',
  'Hungary': 'Hongrie', 'Romania': 'Roumanie', 'Slovakia': 'Slovaquie',
  'Slovenia': 'Slovénie', 'Russia': 'Russie',
  'Bosnia-Herzegovina': 'Bosnie-Herzégovine', 'Bosnia and Herzegovina': 'Bosnie-Herzégovine',
  'Republic of Ireland': 'Irlande', 'Ireland': 'Irlande',
  'Northern Ireland': 'Irlande du Nord', 'Iceland': 'Islande',
  'Finland': 'Finlande', 'Albania': 'Albanie', 'North Macedonia': 'Macédoine du Nord',
  'Georgia': 'Géorgie', 'Kosovo': 'Kosovo', 'Montenegro': 'Monténégro',
  'Bulgaria': 'Bulgarie',

  // Afrique
  'Morocco': 'Maroc', 'Senegal': 'Sénégal', 'Tunisia': 'Tunisie',
  'Algeria': 'Algérie', 'Egypt': 'Égypte', 'Nigeria': 'Nigéria',
  'Cameroon': 'Cameroun', 'Ghana': 'Ghana', 'Ivory Coast': "Côte d'Ivoire",
  "Côte d'Ivoire": "Côte d'Ivoire", 'South Africa': 'Afrique du Sud',
  'Mali': 'Mali', 'Burkina Faso': 'Burkina Faso', 'DR Congo': 'RD Congo',
  'Cape Verde': 'Cap-Vert', 'Gabon': 'Gabon', 'Angola': 'Angola',
  'Zambia': 'Zambie', 'Equatorial Guinea': 'Guinée équatoriale',
  'Guinea': 'Guinée', 'Mauritania': 'Mauritanie', 'Benin': 'Bénin',
  'Namibia': 'Namibie', 'Mozambique': 'Mozambique', 'Uganda': 'Ouganda',
  'Tanzania': 'Tanzanie', 'Kenya': 'Kenya', 'Madagascar': 'Madagascar',
  'Togo': 'Togo', 'Libya': 'Libye', 'Zimbabwe': 'Zimbabwe',

  // Asie & Océanie
  'Japan': 'Japon', 'South Korea': 'Corée du Sud', 'Korea Republic': 'Corée du Sud',
  'Iran': 'Iran', 'IR Iran': 'Iran', 'Saudi Arabia': 'Arabie saoudite',
  'Australia': 'Australie', 'Qatar': 'Qatar', 'Iraq': 'Irak',
  'United Arab Emirates': 'Émirats arabes unis', 'Uzbekistan': 'Ouzbékistan',
  'Jordan': 'Jordanie', 'China PR': 'Chine', 'China': 'Chine',
  'North Korea': 'Corée du Nord', 'Korea DPR': 'Corée du Nord',
  'Oman': 'Oman', 'Bahrain': 'Bahreïn', 'Syria': 'Syrie', 'Lebanon': 'Liban',
  'Vietnam': 'Viêt Nam', 'Thailand': 'Thaïlande', 'India': 'Inde',
  'Indonesia': 'Indonésie', 'New Zealand': 'Nouvelle-Zélande',
  'Palestine': 'Palestine', 'Kuwait': 'Koweït', 'Kyrgyzstan': 'Kirghizistan',
  'Tajikistan': 'Tadjikistan'
};

// Traduit un nom d'équipe ; garde l'original si inconnu
function toFr(name) {
  if (!name) return name;
  return FR[name] || name;
}

module.exports = { toFr };
