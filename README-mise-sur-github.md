# README — Mettre le projet sur GitHub (premier envoi)

Date : 13/06/2026
Dépôt : https://github.com/jlp4keritec/cdm.git (public, vide)

## Ce que contient ce pack
- `.gitignore` : liste des fichiers à NE PAS publier (secrets, comptes,
  paris, config SSH, rapport d'audit, node_modules…).
- `.env.example` : modèle du fichier de configuration, SANS les vraies clés.
- `README.md` : page d'accueil du dépôt (présentation du projet).

## Étape 1 — Poser les 3 fichiers
Copie `.gitignore`, `.env.example` et `README.md` à la racine de
`C:\Agile\coupe-maison` (à côté de `server.js`).

## Étape 2 — Vérifier que Git est installé
Dans PowerShell, dans `C:\Agile\coupe-maison` :

    git --version

Si une version s'affiche : OK. Sinon, installe Git pour Windows
(https://git-scm.com/download/win) puis rouvre PowerShell.

## Étape 3 — Premier envoi
Toujours dans `C:\Agile\coupe-maison`, copie-colle ces commandes une par une :

    git init
    git add .
    git status

⚠️ IMPORTANT — Regarde la liste affichée par `git status` :
elle NE DOIT PAS contenir `.env`, `data/users.json`, `data/bets.json`,
`data/standings-history.json`, `deploy-config.json`, ni `vps-audit-report.txt`.
Si l'un d'eux apparaît, ARRÊTE-TOI et envoie-moi une capture.

Si la liste est propre, continue :

    git commit -m "Première version : Coupe a la maison"
    git branch -M main
    git remote add origin https://github.com/jlp4keritec/cdm.git
    git push -u origin main

GitHub te demandera de te connecter (fenêtre de navigateur ou identifiants).

## Étape 4 — Vérifier sur GitHub
Ouvre https://github.com/jlp4keritec/cdm et vérifie :
- le README s'affiche en bas,
- AUCUN fichier `.env`, `users.json`, `bets.json`, `deploy-config.json`,
  `vps-audit-report.txt` n'est présent.

## Pour les prochaines fois (mises à jour)
Quand tu modifies le projet, tu n'auras qu'à faire :

    git add .
    git commit -m "Description de ce que j'ai changé"
    git push
