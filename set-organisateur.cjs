// ============================================================
//  set-organisateur.cjs
//  Exécuté SUR le serveur (pas sur ton PC).
//  Marque un compte comme organisateur dans data/users.json
//  et inscrit son email comme ADMIN_EMAIL dans .env.
//  Aucune donnée n'est supprimée : une sauvegarde est créée avant.
//
//  Usage (depuis le dossier de l'appli) :
//     node set-organisateur.cjs "Jean-Luc"
//  Si aucun pseudo n'est donné et qu'il n'y a qu'un seul compte,
//  c'est ce compte qui devient organisateur.
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const usersPath = path.join(ROOT, 'data', 'users.json');
const envPath = path.join(ROOT, '.env');
const wantedPseudo = (process.argv[2] || '').trim();

// 1) Lire les comptes
if (!fs.existsSync(usersPath)) {
  console.error('ERREUR: fichier des comptes introuvable: ' + usersPath);
  process.exit(2);
}
let raw = fs.readFileSync(usersPath, 'utf8');
let users;
try {
  users = JSON.parse(raw);
} catch (e) {
  console.error('ERREUR: data/users.json illisible (JSON invalide).');
  process.exit(2);
}

// Le fichier peut être un tableau [ {..}, {..} ] ou un objet { id: {..} }
const isArray = Array.isArray(users);
const list = isArray ? users : Object.values(users);

if (list.length === 0) {
  console.error('ERREUR: aucun compte trouve. Cree ton compte sur le site d\'abord.');
  process.exit(2);
}

// 2) Choisir le compte cible
let target = null;
if (wantedPseudo) {
  target = list.find(u => String(u.pseudo || '').toLowerCase() === wantedPseudo.toLowerCase());
}
if (!target && list.length === 1) {
  target = list[0]; // un seul compte -> c'est lui
}
if (!target) {
  console.error('ERREUR: compte "' + wantedPseudo + '" introuvable.');
  console.error('Comptes existants: ' + list.map(u => u.pseudo).join(', '));
  process.exit(3);
}

// 3) Sauvegarde avant modification
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backup = usersPath + '.bak-' + stamp;
fs.copyFileSync(usersPath, backup);

// 4) Marquer comme organisateur (plusieurs noms de champ par securite)
target.isAdmin = true;
target.admin = true;
target.role = 'admin';

fs.writeFileSync(usersPath, JSON.stringify(users, null, 2) + '\n', 'utf8');

// 5) Inscrire ADMIN_EMAIL dans .env (pour que ca tienne meme apres un redeploiement)
const email = String(target.email || '').trim();
let env = '';
try { env = fs.readFileSync(envPath, 'utf8'); } catch (e) { env = ''; }
const kept = env.split(/\r?\n/).filter(l => l.length && !/^ADMIN_EMAIL=/.test(l));
if (email) kept.push('ADMIN_EMAIL=' + email);
fs.writeFileSync(envPath, kept.join('\n') + '\n', 'utf8');

console.log('OK_ORGANISATEUR pseudo=' + (target.pseudo || '?') + ' email=' + email);
console.log('Sauvegarde des comptes: ' + path.basename(backup));
