// ============================================================
//  Coupe à la maison — fiches d'équipes (données historiques)
//  Source : palmarès officiel des sélections (Coupe du Monde 2026).
//  Clés = noms français (voir teams-fr.js).
//  conf = confédération
//  part = nombre de participations AVANT 2026 (comme l'affiche la FIFA)
//  best = meilleure performance passée · debut = 1re participation
// ============================================================

const INFO = {
  // CONCACAF
  'Canada':         { conf: 'CONCACAF', part: 2,  best: 'Phase de groupes' },
  'Mexique':        { conf: 'CONCACAF', part: 17, best: 'Quart de finale' },
  'États-Unis':     { conf: 'CONCACAF', part: 11, best: '3e place' },
  'Panama':         { conf: 'CONCACAF', part: 1,  best: 'Phase de groupes' },
  'Haïti':          { conf: 'CONCACAF', part: 1,  best: 'Phase de groupes' },
  'Curaçao':        { conf: 'CONCACAF', part: 0,  best: 'Première participation', debut: true },

  // CONMEBOL
  'Argentine':      { conf: 'CONMEBOL', part: 18, best: 'Vainqueur' },
  'Brésil':         { conf: 'CONMEBOL', part: 22, best: 'Vainqueur' },
  'Équateur':       { conf: 'CONMEBOL', part: 4,  best: '8e de finale' },
  'Uruguay':        { conf: 'CONMEBOL', part: 14, best: 'Vainqueur' },
  'Colombie':       { conf: 'CONMEBOL', part: 6,  best: 'Quart de finale' },
  'Paraguay':       { conf: 'CONMEBOL', part: 8,  best: 'Quart de finale' },

  // UEFA
  'Angleterre':     { conf: 'UEFA', part: 16, best: 'Vainqueur' },
  'France':         { conf: 'UEFA', part: 16, best: 'Vainqueur' },
  'Croatie':        { conf: 'UEFA', part: 6,  best: 'Finaliste' },
  'Portugal':       { conf: 'UEFA', part: 8,  best: '3e place' },
  'Norvège':        { conf: 'UEFA', part: 3,  best: '8e de finale' },
  'Allemagne':      { conf: 'UEFA', part: 20, best: 'Vainqueur' },
  'Pays-Bas':       { conf: 'UEFA', part: 11, best: 'Finaliste' },
  'Belgique':       { conf: 'UEFA', part: 14, best: '3e place' },
  'Autriche':       { conf: 'UEFA', part: 7,  best: '3e place' },
  'Suisse':         { conf: 'UEFA', part: 12, best: 'Quart de finale' },
  'Espagne':        { conf: 'UEFA', part: 16, best: 'Vainqueur' },
  'Écosse':         { conf: 'UEFA', part: 8,  best: 'Phase de groupes' },

  // AFC
  'Japon':          { conf: 'AFC', part: 7,  best: '8e de finale' },
  'Iran':           { conf: 'AFC', part: 6,  best: 'Phase de groupes' },
  'Ouzbékistan':    { conf: 'AFC', part: 0,  best: 'Première participation', debut: true },
  'Corée du Sud':   { conf: 'AFC', part: 11, best: '4e place' },
  'Jordanie':       { conf: 'AFC', part: 0,  best: 'Première participation', debut: true },
  'Australie':      { conf: 'AFC', part: 6,  best: '8e de finale' },
  'Qatar':          { conf: 'AFC', part: 1,  best: 'Phase de groupes' },
  'Arabie saoudite':{ conf: 'AFC', part: 6,  best: '8e de finale' },

  // CAF
  'Maroc':          { conf: 'CAF', part: 6,  best: '4e place' },
  'Tunisie':        { conf: 'CAF', part: 6,  best: 'Phase de groupes' },
  'Égypte':         { conf: 'CAF', part: 3,  best: 'Phase de groupes' },
  'Algérie':        { conf: 'CAF', part: 4,  best: '8e de finale' },
  'Ghana':          { conf: 'CAF', part: 4,  best: 'Quart de finale' },
  'Cap-Vert':       { conf: 'CAF', part: 0,  best: 'Première participation', debut: true },
  'Afrique du Sud': { conf: 'CAF', part: 3,  best: 'Phase de groupes' },
  "Côte d'Ivoire":  { conf: 'CAF', part: 3,  best: 'Phase de groupes' },
  'Sénégal':        { conf: 'CAF', part: 3,  best: 'Quart de finale' },

  // OFC
  'Nouvelle-Zélande': { conf: 'OFC', part: 2, best: 'Phase de groupes' },

  // Qualifiés via barrages (historique connu)
  'Bosnie-Herzégovine': { conf: 'UEFA', part: 1, best: 'Phase de groupes' },
  'Irak':               { conf: 'AFC',  part: 1, best: 'Phase de groupes' },
  'RD Congo':           { conf: 'CAF',  part: 1, best: 'Phase de groupes' }
};

const CONF_LABEL = {
  AFC: 'Asie (AFC)', CAF: 'Afrique (CAF)', CONCACAF: 'Am. Nord (CONCACAF)',
  CONMEBOL: 'Am. Sud (CONMEBOL)', OFC: 'Océanie (OFC)', UEFA: 'Europe (UEFA)'
};

function infoFor(name) {
  const i = INFO[name];
  if (!i) return null;
  return {
    conf: i.conf,
    confLabel: CONF_LABEL[i.conf] || i.conf,
    participations: i.part,
    best: i.best,
    debut: !!i.debut
  };
}

module.exports = { infoFor };
