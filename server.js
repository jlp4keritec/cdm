// ============================================================
//  Coupe à la maison - Serveur principal
//  Étape Comptes : page d'accueil, compétition, équipes,
//  + inscription / connexion sécurisées.
// ============================================================

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const football = require('./data/football');
const users = require('./data/users');
const bets = require('./data/bets');
const history = require('./data/history');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Sessions (le visiteur reste connecté) ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-a-changer',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 30 } // 30 jours
}));

// --- Pages ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/competition', (req, res) => res.sendFile(path.join(__dirname, 'public', 'competition.html')));
app.get('/equipes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'equipes.html')));
app.get('/compte', (req, res) => res.sendFile(path.join(__dirname, 'public', 'compte.html')));
app.get('/paris', (req, res) => res.sendFile(path.join(__dirname, 'public', 'paris.html')));
app.get('/palmares', (req, res) => res.sendFile(path.join(__dirname, 'public', 'palmares.html')));
app.get('/tableau', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tableau.html')));
app.get('/stats', (req, res) => res.sendFile(path.join(__dirname, 'public', 'stats.html')));
app.get('/tv', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tv.html')));

// --- Données football ---
app.get('/api/groups', async (req, res) => {
  try { res.json(await football.getGroups()); }
  catch (err) { res.status(502).json({ error: err.message }); }
});
app.get('/api/matches', async (req, res) => {
  try { res.json(await football.getMatches()); }
  catch (err) { res.status(502).json({ error: err.message }); }
});
app.get('/api/teams', async (req, res) => {
  try { res.json(await football.getTeams()); }
  catch (err) { res.status(502).json({ error: err.message }); }
});

// --- Paris (pronostics) ---
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ error: 'Connexion requise.' });
}

// Le match est-il encore "pariable" ?
function isBettable(m) {
  if (!m) return false;
  if (m.home === 'À déterminer' || m.away === 'À déterminer') return false;
  const notStartedStatus = m.status === 'SCHEDULED' || m.status === 'TIMED';
  const inFuture = new Date(m.date) > new Date();
  return notStartedStatus && inFuture;
}

app.post('/api/bets', requireAuth, async (req, res) => {
  const matchId = Number(req.body && req.body.matchId);
  const home = parseInt(req.body && req.body.home, 10);
  const away = parseInt(req.body && req.body.away, 10);

  if (!Number.isInteger(matchId)) return res.status(400).json({ error: 'Match invalide.' });
  if (!Number.isInteger(home) || !Number.isInteger(away) || home < 0 || away < 0 || home > 30 || away > 30) {
    return res.status(400).json({ error: 'Score invalide (entre 0 et 30).' });
  }

  let matchList;
  try { matchList = await football.getMatches(); }
  catch (e) { return res.status(502).json({ error: 'Données des matchs indisponibles.' }); }

  const m = matchList.find((x) => x.id === matchId);
  if (!m) return res.status(404).json({ error: 'Match introuvable.' });
  if (!isBettable(m)) return res.status(400).json({ error: 'Trop tard : le match a commencé (ou équipes inconnues).' });

  bets.setBet(req.session.userId, matchId, home, away);
  res.json({ ok: true });
});

app.get('/api/bets/me', requireAuth, async (req, res) => {
  const mine = bets.getUserBets(req.session.userId);
  let matchList = [];
  try { matchList = await football.getMatches(); } catch (e) {}
  const byId = {};
  matchList.forEach((m) => { byId[m.id] = m; });

  let total = 0;
  const map = {};
  mine.forEach((b) => {
    const m = byId[b.matchId];
    const pts = m ? bets.pointsFor(b.home, b.away, m.scoreHome, m.scoreAway) : null;
    if (pts != null) total += pts;
    map[b.matchId] = { home: b.home, away: b.away, points: pts };
  });
  res.json({ bets: map, totalPoints: total });
});

// Calcule le classement de tous les joueurs (points, exacts, bons résultats)
function computeStandings(matchList) {
  const byId = {};
  (matchList || []).forEach((m) => { byId[m.id] = m; });
  const stat = {};
  users.listUsers().forEach((u) => {
    stat[u.id] = { id: u.id, pseudo: u.pseudo, points: 0, exact: 0, correct: 0, scored: 0, placed: 0 };
  });
  bets.allBets().forEach((b) => {
    const s = stat[b.userId];
    if (!s) return;
    s.placed++;
    const m = byId[b.matchId];
    const pts = m ? bets.pointsFor(b.home, b.away, m.scoreHome, m.scoreAway) : null;
    if (pts != null) {
      s.scored++;
      s.points += pts;
      if (pts === 3) s.exact++;
      else if (pts === 1) s.correct++;
    }
  });
  const arr = Object.values(stat).sort((a, b) =>
    b.points - a.points || b.exact - a.exact || a.pseudo.localeCompare(b.pseudo));
  arr.forEach((s, i) => { s.rank = i + 1; });
  return arr;
}

// Stats fun (public) : titres rigolos calculés sur les paris existants.
// Les joueurs sans aucun pari sont exclus.
app.get('/api/stats', async (req, res) => {
  let ml = [];
  try { ml = await football.getMatches(); } catch (e) {}
  const byId = {};
  ml.forEach((m) => { byId[m.id] = m; });

  // Regroupe les paris par joueur
  const usersById = {};
  users.listUsers().forEach((u) => { usersById[u.id] = u.pseudo; });

  const players = {};   // userId -> agrégats
  const allScores = {}; // "h-a" -> nombre de fois pronostiqué (tous joueurs)
  let totalBets = 0;
  let totalGoals = 0;

  bets.allBets().forEach((b) => {
    if (usersById[b.userId] == null) return;            // joueur supprimé : on ignore
    const p = players[b.userId] || (players[b.userId] = {
      pseudo: usersById[b.userId], placed: 0, scored: 0,
      exact: 0, correct: 0, goals: 0, favScores: {}
    });
    p.placed++;
    p.goals += (b.home + b.away);
    totalBets++;
    totalGoals += (b.home + b.away);

    const key = b.home + '-' + b.away;
    allScores[key] = (allScores[key] || 0) + 1;
    p.favScores[key] = (p.favScores[key] || 0) + 1;

    const m = byId[b.matchId];
    const pts = m ? bets.pointsFor(b.home, b.away, m.scoreHome, m.scoreAway) : null;
    if (pts != null) {
      p.scored++;
      if (pts === 3) p.exact++;
      else if (pts === 1) p.correct++;
    }
  });

  // On ne garde que les joueurs ayant au moins un pari
  const list = Object.values(players).filter((p) => p.placed > 0);

  // Helper : meilleur joueur selon une fonction de score (et un minimum)
  function leader(scoreFn, minPlaced) {
    let best = null;
    list.forEach((p) => {
      if (minPlaced && p.placed < minPlaced) return;
      const v = scoreFn(p);
      if (v == null) return;
      if (!best || v > best.value) best = { pseudo: p.pseudo, value: v };
    });
    return best;
  }
  function loserLow(scoreFn, minPlaced) {  // plus PETITE valeur
    let best = null;
    list.forEach((p) => {
      if (minPlaced && p.placed < minPlaced) return;
      const v = scoreFn(p);
      if (v == null) return;
      if (!best || v < best.value) best = { pseudo: p.pseudo, value: v };
    });
    return best;
  }

  const round1 = (x) => Math.round(x * 10) / 10;

  const titles = {
    sniper:  leader((p) => p.exact),                                  // + de scores exacts
    voyant:  leader((p) => p.scored ? p.correct + p.exact : null, 1), // + de bons paris
    flambeur: leader((p) => p.placed ? round1(p.goals / p.placed) : null), // + de buts/pari
    prudent:  loserLow((p) => p.placed ? round1(p.goals / p.placed) : null), // - de buts/pari
    assidu:   leader((p) => p.placed)                                 // + de paris
  };

  // Score le plus pronostiqué (tous joueurs confondus)
  let topScore = null;
  Object.keys(allScores).forEach((k) => {
    if (!topScore || allScores[k] > topScore.count) topScore = { score: k.replace('-', ' - '), count: allScores[k] };
  });

  res.json({
    players: list.length,
    totalBets,
    avgGoals: totalBets ? round1(totalGoals / totalBets) : 0,
    topScore,
    titles
  });
});

// Palmarès (public) : classement de tous les parieurs
app.get('/api/leaderboard', async (req, res) => {
  let ml = [];
  try { ml = await football.getMatches(); } catch (e) {}
  const full = computeStandings(ml);

  // Photo du classement pour les flèches d'évolution.
  // prevRanks = rangs lors du dernier changement de classement.
  let prevRanks = null;
  try { prevRanks = history.updateAndGetPrevious(full); } catch (e) {}

  const standings = full.map((s) => {
    let trend = 'same';            // par défaut : stable
    if (!prevRanks) {
      trend = 'none';              // pas encore d'historique
    } else if (prevRanks[s.pseudo] == null) {
      trend = 'new';               // nouveau venu au classement
    } else if (prevRanks[s.pseudo] > s.rank) {
      trend = 'up';                // a gagné des places (rang plus petit)
    } else if (prevRanks[s.pseudo] < s.rank) {
      trend = 'down';              // a perdu des places
    }
    return {
      rank: s.rank, pseudo: s.pseudo, points: s.points,
      exact: s.exact, correct: s.correct, placed: s.placed,
      trend
    };
  });
  res.json(standings);
});

// Tableau de bord (perso) : stats du joueur connecté + son rang
app.get('/api/dashboard', requireAuth, async (req, res) => {
  let ml = [];
  try { ml = await football.getMatches(); } catch (e) {}
  const standings = computeStandings(ml);
  const me = standings.find((s) => s.id === req.session.userId);
  res.json({
    pseudo: (me && me.pseudo) || req.session.pseudo,
    points: me ? me.points : 0,
    rank: me ? me.rank : null,
    totalPlayers: standings.length,
    placed: me ? me.placed : 0,
    scored: me ? me.scored : 0,
    exact: me ? me.exact : 0,
    correct: me ? me.correct : 0
  });
});

// --- Sécurité : limite des tentatives (anti-force brute) ---
const attempts = new Map();
function authLimiter(req, res, next) {
  const ip = req.ip || 'inconnu';
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > 15 * 60 * 1000) { rec.count = 0; rec.first = now; }
  rec.count++;
  attempts.set(ip, rec);
  if (rec.count > 30) {
    return res.status(429).json({ error: 'Trop de tentatives. Réessaie dans quelques minutes.' });
  }
  next();
}

function validEmail(e) {
  return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// --- Comptes ---
app.post('/api/register', authLimiter, (req, res) => {
  const { pseudo, email, password } = req.body || {};
  const p = (pseudo || '').trim();
  if (p.length < 2 || p.length > 20) {
    return res.status(400).json({ error: 'Le pseudo doit faire entre 2 et 20 caractères.' });
  }
  if (!validEmail((email || '').trim())) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères.' });
  }
  try {
    const user = users.createUser({ pseudo: p, email, password });
    req.session.userId = user.id;
    req.session.pseudo = user.pseudo;
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post('/api/login', authLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  const user = users.verifyUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }
  req.session.userId = user.id;
  req.session.pseudo = user.pseudo;
  res.json(user);
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', (req, res) => {
  if (req.session && req.session.userId) {
    const u = users.findById(req.session.userId);
    res.json({ pseudo: req.session.pseudo, isAdmin: isAdminUser(u) });
  } else {
    res.json(null);
  }
});

// --- Espace organisateur (admin) ---
// L'organisateur = le compte indiqué dans ADMIN_EMAIL, sinon le 1er compte créé.
function isAdminUser(u) {
  if (!u) return false;
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (adminEmail) return u.email === adminEmail;
  const all = users.listUsers();
  return all.length > 0 && all[0].id === u.id;
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Connexion requise.' });
  }
  const u = users.findById(req.session.userId);
  if (!isAdminUser(u)) {
    return res.status(403).json({ error: "Réservé à l'organisateur." });
  }
  next();
}

// Mot de passe temporaire lisible (sans caractères ambigus)
function tempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const buf = require('crypto').randomBytes(10);
  let s = '';
  for (const b of buf) s += chars[b % chars.length];
  return s;
}

app.get('/api/admin/users', requireAdmin, (req, res) => {
  res.json(users.listUsers().map((u) => ({ id: u.id, pseudo: u.pseudo, email: u.email })));
});

app.post('/api/admin/reset', requireAdmin, (req, res) => {
  const { userId } = req.body || {};
  const target = users.findById(userId);
  if (!target) return res.status(404).json({ error: 'Compte introuvable.' });
  const temp = tempPassword();
  users.resetPassword(userId, temp);
  res.json({ pseudo: target.pseudo, tempPassword: temp });
});

// --- Démarrage ---
app.listen(PORT, () => {
  console.log('======================================================');
  console.log('  ⚽  Coupe à la maison est lancée !');
  console.log('  ➜  Ouvre ton navigateur sur : http://localhost:' + PORT);
  console.log('  (Pour arrêter le site : touches Ctrl + C)');
  console.log('======================================================');
});
