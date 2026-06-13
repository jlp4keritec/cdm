// ============================================================
//  Coupe à la maison — comptes utilisateurs
//  Mots de passe chiffrés (jamais stockés en clair) via scrypt.
//  Stockage simple dans data/users.json.
// ============================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, 'users.json');

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
  catch (e) { return []; }
}
function save(users) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

function makeSalt() { return crypto.randomBytes(16).toString('hex'); }
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// On ne renvoie jamais le mot de passe ni le sel au reste de l'appli
function publicUser(u) {
  return { id: u.id, pseudo: u.pseudo, email: u.email };
}

function findById(id) {
  return load().find((u) => u.id === id) || null;
}

// Liste publique des comptes, triée du plus ancien au plus récent
function listUsers() {
  return load()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((u) => ({ id: u.id, pseudo: u.pseudo, email: u.email, createdAt: u.createdAt }));
}

// Réinitialise le mot de passe d'un compte (nouveau sel + nouveau chiffrement)
function resetPassword(id, newPassword) {
  const all = load();
  const u = all.find((x) => x.id === id);
  if (!u) return false;
  u.salt = makeSalt();
  u.hash = hashPassword(newPassword, u.salt);
  save(all);
  return true;
}

// Crée un compte (lève une erreur si email/pseudo déjà pris)
function createUser({ pseudo, email, password }) {
  const users = load();
  const e = email.trim().toLowerCase();
  const p = pseudo.trim();

  if (users.some((u) => u.email === e)) {
    const err = new Error('Cet email est déjà utilisé.');
    err.status = 409; throw err;
  }
  if (users.some((u) => u.pseudo.toLowerCase() === p.toLowerCase())) {
    const err = new Error('Ce pseudo est déjà pris.');
    err.status = 409; throw err;
  }

  const salt = makeSalt();
  const user = {
    id: crypto.randomUUID(),
    pseudo: p,
    email: e,
    salt,
    hash: hashPassword(password, salt),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  save(users);
  return publicUser(user);
}

// Vérifie email + mot de passe ; renvoie l'utilisateur public ou null
function verifyUser(email, password) {
  const e = String(email).trim().toLowerCase();
  const u = load().find((x) => x.email === e);
  if (!u) return null;
  const candidate = Buffer.from(hashPassword(password, u.salt), 'hex');
  const stored = Buffer.from(u.hash, 'hex');
  if (candidate.length !== stored.length) return null;
  if (!crypto.timingSafeEqual(candidate, stored)) return null;
  return publicUser(u);
}

module.exports = { createUser, verifyUser, findById, publicUser, listUsers, resetPassword };
