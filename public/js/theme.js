// ============================================================
//  Coupe à la maison — thème clair / sombre (mémorisé)
// ============================================================

// Applique le thème enregistré le plus tôt possible
(function () {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
})();

// Branche le bouton de bascule une fois la page chargée
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair');
  };

  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  apply(current);

  btn.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(now);
  });
});
