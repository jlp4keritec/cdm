// ============================================================
//  Coupe à la maison — récupération des données du Mondial
//  Source : football-data.org (la clé reste côté serveur)
// ============================================================

const API_BASE = 'https://api.football-data.org/v4';
const COMP = 'WC'; // WC = FIFA World Cup
const { toFr } = require('./teams-fr');
const { infoFor } = require('./teams-info');
const { rankFor, RANK_DATE } = require('./fifa-ranking');
const { pronoFor } = require('./pronostic');

// Petit cache mémoire : on garde la réponse 60 s pour ne pas
// dépasser la limite gratuite (10 appels / minute).
const TTL = 60 * 1000;
const cache = {
  groups:  { at: 0, data: null },
  matches: { at: 0, data: null },
  scorers: { at: 0, data: null }
};

// Appel générique à l'API avec la clé secrète
async function callApi(pathname) {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) {
    throw new Error("Clé manquante : vérifie le fichier .env (FOOTBALL_API_KEY).");
  }
  const res = await fetch(API_BASE + pathname, {
    headers: { 'X-Auth-Token': key }
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 200); } catch (_) {}
    throw new Error('football-data.org a répondu ' + res.status + '. ' + detail);
  }
  return res.json();
}

// --- Les matchs (tous les tours) ---
async function getMatches() {
  if (cache.matches.data && Date.now() - cache.matches.at < TTL) {
    return cache.matches.data;
  }
  const json = await callApi('/competitions/' + COMP + '/matches');
  const matches = (json.matches || []).map((m) => {
    const home = toFr((m.homeTeam && m.homeTeam.name)) || 'À déterminer';
    const away = toFr((m.awayTeam && m.awayTeam.name)) || 'À déterminer';
    return {
      id: m.id,
      date: m.utcDate,
      status: m.status,                       // SCHEDULED, IN_PLAY, FINISHED...
      stage: m.stage,                         // GROUP_STAGE, LAST_16...
      group: m.group || null,                 // GROUP_A...
      home: home,
      homeCrest: (m.homeTeam && m.homeTeam.crest) || null,
      away: away,
      awayCrest: (m.awayTeam && m.awayTeam.crest) || null,
      scoreHome: m.score && m.score.fullTime ? m.score.fullTime.home : null,
      scoreAway: m.score && m.score.fullTime ? m.score.fullTime.away : null,
      winner: m.score ? m.score.winner : null,
      venue: m.venue || null,                 // lieu fourni par l'API (souvent le stade)
      prono: pronoFor(home, away)             // pronostic Kikko (peut être null)
    };
  });
  cache.matches = { at: Date.now(), data: matches };
  return matches;
}

// --- Les poules, calculées à partir des matchs (robuste) ---
async function groupsFromMatches() {
  const matches = await getMatches();
  const groups = {}; // { GROUP_A: { "France": {...}, ... } }

  for (const m of matches) {
    if (!m.group) continue;                 // on ne garde que la phase de groupes
    groups[m.group] = groups[m.group] || {};

    const ensure = (name, crest) => {
      if (!name || name === 'À déterminer') return null;
      if (!groups[m.group][name]) {
        groups[m.group][name] = {
          team: name, crest: crest || null,
          played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0
        };
      } else if (crest && !groups[m.group][name].crest) {
        groups[m.group][name].crest = crest;
      }
      return groups[m.group][name];
    };

    const home = ensure(m.home, m.homeCrest);
    const away = ensure(m.away, m.awayCrest);
    const finished = m.status === 'FINISHED' && m.scoreHome != null && m.scoreAway != null;

    if (home && away && finished) {
      home.played++; away.played++;
      home.gf += m.scoreHome; home.ga += m.scoreAway;
      away.gf += m.scoreAway; away.ga += m.scoreHome;
      if (m.scoreHome > m.scoreAway)      { home.won++;  away.lost++; }
      else if (m.scoreHome < m.scoreAway) { away.won++;  home.lost++; }
      else                                { home.draw++; away.draw++; }
    }
  }

  return Object.keys(groups).sort().map((g) => {
    const teams = Object.values(groups[g]).map((t) => ({
      ...t,
      gd: t.gf - t.ga,
      points: t.won * 3 + t.draw
    }));
    teams.sort((a, b) =>
      b.points - a.points ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.team.localeCompare(b.team)
    );
    teams.forEach((t, i) => { t.position = i + 1; });
    return { group: g, table: teams };
  });
}

// Fallback : classement fourni directement par le service
async function groupsFromStandings() {
  const json = await callApi('/competitions/' + COMP + '/standings');
  return (json.standings || [])
    .filter((s) => s.group && (!s.type || s.type === 'TOTAL'))
    .map((s) => ({
      group: s.group,
      table: (s.table || []).map((r) => ({
        position: r.position,
        team: toFr((r.team && r.team.name)) || '—',
        crest: (r.team && r.team.crest) || null,
        played: r.playedGames, won: r.won, draw: r.draw, lost: r.lost,
        gf: r.goalsFor, ga: r.goalsAgainst, gd: r.goalDifference,
        points: r.points
      }))
    }));
}

async function getGroups() {
  if (cache.groups.data && Date.now() - cache.groups.at < TTL) {
    return cache.groups.data;
  }
  let data = await groupsFromMatches();
  if (!data.length) {
    try { data = await groupsFromStandings(); } catch (_) { data = []; }
  }
  cache.groups = { at: Date.now(), data };
  return data;
}

// --- Toutes les équipes, avec leur groupe et leurs stats ---
async function getTeams() {
  const groups = await getGroups();
  const teams = [];
  for (const g of groups) {
    g.table.forEach((r) => {
      const info = infoFor(r.team);
      teams.push({
        name: r.team,
        crest: r.crest,
        group: g.group,
        position: r.position,
        played: r.played, won: r.won, draw: r.draw, lost: r.lost,
        gf: r.gf, ga: r.ga, gd: r.gd, points: r.points,
        // Infos historiques (peuvent être absentes pour quelques équipes)
        conf: info ? info.conf : null,
        confLabel: info ? info.confLabel : null,
        participations: info ? info.participations : null,
        best: info ? info.best : null,
        debut: info ? info.debut : false,
        // Classement mondial FIFA (1er avril 2026)
        rank: rankFor(r.team),
        rankDate: RANK_DATE
      });
    });
  }
  // tri par groupe puis par nom
  teams.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  return teams;
}

// --- Les meilleurs buteurs (classement officiel de l'API) ---
async function getScorers() {
  if (cache.scorers.data && Date.now() - cache.scorers.at < TTL) {
    return cache.scorers.data;
  }
  // limit=10 : on demande le Top 10 directement à l'API
  const json = await callApi('/competitions/' + COMP + '/scorers?limit=10');
  const scorers = (json.scorers || []).map((s, i) => ({
    position: i + 1,
    player: (s.player && s.player.name) || '—',
    team: toFr((s.team && s.team.name)) || (s.team && s.team.name) || '—',
    crest: (s.team && s.team.crest) || null,
    goals: s.goals != null ? s.goals : 0,
    penalties: s.penalties != null ? s.penalties : 0,
    matches: s.playedMatches != null ? s.playedMatches : null
  }));
  cache.scorers = { at: Date.now(), data: scorers };
  return scorers;
}

module.exports = { getGroups, getMatches, getTeams, getScorers };
