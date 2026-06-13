// ============================================================
//  Coupe à la maison — état de connexion dans la barre du haut
// ============================================================

(async function () {
  let me = null;
  try {
    const res = await fetch('/api/me');
    me = await res.json();
  } catch (e) {}

  const nav = document.querySelector('.nav-links');
  const ghost = document.querySelector('.nav-links .btn-ghost'); // bouton "Connexion"
  const solid = document.querySelector('.nav-links .btn-solid'); // bouton "S'inscrire"
  if (!ghost && !solid) return;

  if (me && me.pseudo) {
    // Connecté : on masque les boutons d'appel à l'inscription sur l'accueil
    const heroActions = document.getElementById('hero-actions');
    if (heroActions) heroActions.style.display = 'none';

    // Connecté : on affiche le pseudo + un bouton Déconnexion
    if (ghost) {
      ghost.textContent = '👤 ' + me.pseudo;
      ghost.href = '/tableau';
    }
    if (solid) {
      solid.textContent = 'Déconnexion';
      solid.href = '#';
      solid.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await fetch('/api/logout', { method: 'POST' }); } catch (err) {}
        location.href = '/';
      });
    }

    // Organisateur uniquement : lien vers la gestion des comptes (/compte)
    if (me.isAdmin && nav && ghost) {
      const orga = document.createElement('a');
      orga.href = '/compte';
      orga.textContent = '⚙️ Organisateur';
      orga.className = 'nav-orga';
      const themeBtn = document.getElementById('theme-toggle');
      nav.insertBefore(orga, themeBtn || ghost);
    }
  }
  // Sinon (déconnecté) : les boutons gardent "Connexion" / "S'inscrire"
  // qui pointent déjà vers /compte (voir le HTML).
})();
