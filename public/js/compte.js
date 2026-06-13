// ============================================================
//  Coupe à la maison — connexion / inscription / organisateur
// ============================================================

function showPanel(which) {
  ['login', 'register', 'connected', 'admin'].forEach((p) => {
    const el = document.getElementById('panel-' + p);
    if (el) el.classList.toggle('is-active', p === which);
  });
  document.querySelectorAll('[data-auth]').forEach((b) => b.classList.toggle('is-active', b.dataset.auth === which));
}

function setMsg(id, text, ok) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text || '';
  el.className = 'auth-msg' + (text ? (ok ? ' ok' : ' err') : '');
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  return { ok: res.ok, data };
}

async function logout() {
  try { await fetch('/api/logout', { method: 'POST' }); } catch (e) {}
  location.href = '/';
}

// --- Au chargement : on choisit le bon écran selon l'état de connexion ---
(async function init() {
  let me = null;
  try { me = await (await fetch('/api/me')).json(); } catch (e) {}

  const tabs = document.querySelector('.auth-tabs');

  if (me && me.pseudo) {
    if (tabs) tabs.style.display = 'none';      // pas de connexion/inscription si déjà connecté
    if (me.isAdmin) {
      showPanel('admin');
      loadAdminUsers();
    } else {
      const who = document.getElementById('connected-who');
      if (who) who.textContent = 'Tu es connecté en tant que ' + me.pseudo + '.';
      showPanel('connected');
    }
  } else {
    showPanel(location.hash === '#register' ? 'register' : 'login');
  }
})();

// Onglets (uniquement quand déconnecté)
document.querySelectorAll('[data-auth]').forEach((b) => {
  b.addEventListener('click', () => showPanel(b.dataset.auth));
});

// --- Lien "mot de passe oublié" ---
const forgotLink = document.getElementById('forgot-link');
if (forgotLink) {
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    const note = document.getElementById('forgot-note');
    if (note) note.hidden = !note.hidden;
  });
}

// --- Connexion ---
const loginBtn = document.getElementById('login-btn');
if (loginBtn) loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (!email || !password) { setMsg('login-msg', 'Remplis ton email et ton mot de passe.', false); return; }
  loginBtn.disabled = true;
  const { ok, data } = await postJSON('/api/login', { email, password });
  loginBtn.disabled = false;
  if (ok) { setMsg('login-msg', 'Connexion réussie ! Redirection…', true); setTimeout(() => location.href = '/', 600); }
  else { setMsg('login-msg', (data && data.error) || 'Connexion impossible.', false); }
});

// --- Inscription ---
const regBtn = document.getElementById('reg-btn');
if (regBtn) regBtn.addEventListener('click', async () => {
  const pseudo = document.getElementById('reg-pseudo').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  if (!pseudo || !email || !password) { setMsg('reg-msg', 'Merci de tout remplir.', false); return; }
  if (password.length < 8) { setMsg('reg-msg', 'Le mot de passe doit faire au moins 8 caractères.', false); return; }
  regBtn.disabled = true;
  const { ok, data } = await postJSON('/api/register', { pseudo, email, password });
  regBtn.disabled = false;
  if (ok) { setMsg('reg-msg', 'Compte créé ! Redirection…', true); setTimeout(() => location.href = '/', 600); }
  else { setMsg('reg-msg', (data && data.error) || 'Inscription impossible.', false); }
});

// --- Déconnexion ---
['logout-link', 'logout-link2'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', (e) => { e.preventDefault(); logout(); });
});

// --- Espace organisateur : liste + réinitialisation ---
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
}

async function loadAdminUsers() {
  const sel = document.getElementById('admin-user');
  if (!sel) return;
  try {
    const list = await (await fetch('/api/admin/users')).json();
    if (Array.isArray(list)) {
      sel.innerHTML = list.map((u) =>
        '<option value="' + esc(u.id) + '">' + esc(u.pseudo) + ' (' + esc(u.email) + ')</option>'
      ).join('');
    }
  } catch (e) {
    setMsg('admin-msg', "Impossible de charger la liste.", false);
  }
}

const adminBtn = document.getElementById('admin-reset-btn');
if (adminBtn) adminBtn.addEventListener('click', async () => {
  const sel = document.getElementById('admin-user');
  const userId = sel && sel.value;
  if (!userId) { setMsg('admin-msg', 'Choisis un participant.', false); return; }

  // Mot de passe personnalisé (optionnel). Vide = génération automatique.
  const pwdInput = document.getElementById('admin-newpwd');
  const newPassword = pwdInput ? pwdInput.value.trim() : '';
  if (newPassword && newPassword.length < 8) {
    setMsg('admin-msg', 'Le mot de passe doit faire au moins 8 caractères (ou laisse le champ vide).', false);
    return;
  }

  adminBtn.disabled = true;
  setMsg('admin-msg', '', true);
  const body = newPassword ? { userId, newPassword } : { userId };
  const { ok, data } = await postJSON('/api/admin/reset', body);
  adminBtn.disabled = false;
  if (ok) {
    const box = document.getElementById('reset-result');
    const label = document.getElementById('reset-label');
    if (label) label.textContent = data.custom ? 'Mot de passe choisi' : 'Mot de passe temporaire';
    document.getElementById('reset-pwd').textContent = data.tempPassword;
    box.hidden = false;
    if (pwdInput) pwdInput.value = '';
    setMsg('admin-msg', 'Mot de passe de ' + data.pseudo + ' réinitialisé.', true);
  } else {
    setMsg('admin-msg', (data && data.error) || 'Réinitialisation impossible.', false);
  }
});

document.getElementById('login-password') &&
  document.getElementById('login-password').addEventListener('keydown', (e) => { if (e.key === 'Enter') loginBtn.click(); });
document.getElementById('reg-password') &&
  document.getElementById('reg-password').addEventListener('keydown', (e) => { if (e.key === 'Enter') regBtn.click(); });
