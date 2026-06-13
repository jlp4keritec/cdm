# Pronostic "Kikko" — livraison

## Ce que ça fait
Sur la page **Paris**, sous chaque match à pronostiquer, le texte
"Choisis ton score" devient :

> **Kikko pronostique France (56 %).** Choisis ton score  ⓘ

L'icône **ⓘ** (au survol ou au focus) affiche l'analyse :
> France est 1ʳᵉ au classement FIFA, Sénégal 14ᵉ. Estimation Kikko :
> France 56 %, nul 19 %, Sénégal 25 %. Score probable : 2 - 1.

Kikko calcule tout seul à partir du **classement FIFA** déjà présent
dans ton projet. Rien à installer, aucune clé, aucun site externe.

## Fichiers (à remplacer dans ton projet)
1. `data/pronostic.js`   ← NOUVEAU fichier (le cerveau de Kikko)
2. `data/football.js`    ← remplace l'ancien
3. `public/js/paris.js`  ← remplace l'ancien
4. `public/css/paris.css`← remplace l'ancien

## Fonction principale livrée
- `pronoFor(home, away)` dans `data/pronostic.js`
  → renvoie { favorite, label, probHome, probDraw, probAway, scoreHome, scoreAway, tip }
  → renvoie `null` si une équipe est inconnue (Kikko reste alors muet).
- Helper front : `kikkoHint(m)` dans `public/js/paris.js`.

## Pour tester
1. Remplace les 4 fichiers.
2. `npm start`
3. `Ctrl + F5` sur la page **Paris** (connecté).
4. Survole le ⓘ pour voir l'analyse.

## Note
La base de calcul est le rang FIFA. On pourra plus tard le passer à
l'Elo (plus précis) sans rien changer pour toi : seul `pronostic.js`
évoluera.
