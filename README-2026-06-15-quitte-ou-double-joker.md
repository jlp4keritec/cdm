# 🎲 Quitte ou double & 🃏 Joker — Release prod

Paquet **complet** (étapes 1 + 2) prêt à déployer sur **coupe.arkkam.com**.

## Ce que la fonctionnalité apporte

Sur chaque match, le joueur choisit un mode (un seul par match) :

- **Prono normal** — règle habituelle : bon résultat = 1 pt, score exact = 3 pts.
- **🎲 Quitte ou double** — il mise X points :
  - score exact = **+3 × la mise**,
  - bon résultat seulement = **+1,5 × la mise** (arrondi au point supérieur),
  - perdu = **− la mise**.
- **🃏 Joker** — il mise **2 points** et gagne le **nombre total de buts** du match
  (peu importe le prono ; un 0-0 coûte 2 pts).

Les points d'un mode misé **remplacent** le 1/3 pt normal du match. Le joueur ne
peut miser que les points qu'il possède (**portefeuille**), vérifié côté serveur.

## Fichiers livrés (à extraire par-dessus `C:\Agile\coupe-maison`)

- `data/bets.js` — modes + `gamePointsFor` (calcul des points par mode).
- `server.js` — routes de pari (mode/mise), portefeuille, classement, et
  « tout parier au hasard » qui n'écrase pas les mises.
- `public/paris.html` — portefeuille « à miser » en en-tête.
- `public/js/paris.js` — choix du mode, mise + aperçu, joker, gains/pertes.
- `public/css/paris.css` — style des nouveaux éléments.
- `public/index.html` — carte « Quitte ou double & Joker » dans « Quoi de neuf ? ».

## 🚀 Déploiement (depuis TON PC Windows)

> Le déploiement se fait avec ton script existant `deploy-coupe-maison.ps1`.
> Rien de nouveau côté serveur : même app, même domaine, même port. C'est une
> simple mise à jour de fichiers.

1. **Extraire** ce ZIP par-dessus `C:\Agile\coupe-maison` (l'arborescence est
   respectée — tu peux remplacer les fichiers existants).
2. *(Conseillé)* **Test rapide en local** avant prod :
   ```
   npm start
   ```
   Ouvre http://localhost:3000/paris, **Ctrl + F5**, pose un Quitte ou double et
   un Joker. Puis arrête (Ctrl + C).
3. **Déployer** :
   ```
   powershell -ExecutionPolicy Bypass -File .\deploy-coupe-maison.ps1
   ```
   (si Windows bloque le script : clic droit → Propriétés → « Débloquer », ou
   `Unblock-File .\deploy-coupe-maison.ps1`)
4. **Envoie-moi le résultat** du script (capture ou copier-coller de la fin).

## ✅ Vérifications après mise en ligne (sur coupe.arkkam.com)

1. Ouvre **coupe.arkkam.com/paris** en **Ctrl + Shift + R** (vide le cache).
2. En haut : tu vois tes **points** + le nombre **« à miser »**.
3. Sur un match : les 3 boutons de mode apparaissent ; **Quitte ou double**
   montre la case mise + l'aperçu des gains ; **Joker** valide en 1 clic.
4. Console du navigateur (F12) : **aucune erreur** rouge.
5. Le **Palmarès** s'affiche normalement.

## ↩️ En cas de souci

Ton script garde une sauvegarde avant déploiement. Si quelque chose cloche,
dis-le-moi avec le message d'erreur : on remet la version précédente.

> Aucune nouvelle dépendance, aucune clé, aucun appel externe. `bets.json` et
> `users.json` (tes données) ne sont pas touchés.
