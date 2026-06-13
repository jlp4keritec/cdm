# CHANGELOG — Espace organisateur (13/06/2026)

## Corrigé
- **Liste « Participant » illisible** (texte noir sur fond sombre) :
  fond uni + couleurs forcées sur la liste et ses options, en thème
  sombre et en thème clair. (`public/css/compte.css`)

## Ajouté
- **Mot de passe personnalisé** dans l'Espace organisateur :
  nouveau champ optionnel ; s'il est rempli (≥ 8 caractères), c'est ce
  mot de passe qui est appliqué ; sinon, génération automatique comme avant.
  (`public/compte.html`, `public/js/compte.js`, `server.js` — route `/api/admin/reset`)

## Sécurité
- Échappement des pseudos/emails injectés dans la liste déroulante
  (protection contre les caractères spéciaux). Aucun changement visible.

## Inchangé
- Règle des paris, calcul des points, pages Paris/Palmarès/Tableau,
  données `users.json` / `bets.json`, script de déploiement.
