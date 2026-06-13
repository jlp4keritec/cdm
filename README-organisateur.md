# Devenir organisateur sur le site en ligne

## Ce que ca fait
Marque ton compte (Jean-Luc) comme **organisateur** sur le serveur, pour que tu
puisses gerer / reinitialiser les mots de passe des autres joueurs.
- Tes pronos et les autres comptes ne sont PAS touches.
- Une sauvegarde des comptes est faite automatiquement avant toute modification.

## Fonction livree
- `make-organisateur-coupe-maison.ps1` : le script a lancer depuis ton PC.
- `set-organisateur.cjs` : le petit programme qui tourne sur le serveur
  (envoye automatiquement par le script, tu n'as rien a faire avec).

## Ce qu'il y a dans le ZIP (a coller a la racine du projet)
- make-organisateur-coupe-maison.ps1
- set-organisateur.cjs
Les deux doivent rester cote a cote dans C:\Agile\coupe-maison\

## Etapes
1. Decompresse ce ZIP dans C:\Agile\coupe-maison
   (les 2 fichiers se posent a la racine, a cote de deploy-coupe-maison.ps1).
2. Ouvre PowerShell dans C:\Agile\coupe-maison et lance :

       Unblock-File .\make-organisateur-coupe-maison.ps1
       .\make-organisateur-coupe-maison.ps1

   (Si ton pseudo n'est pas "Jean-Luc", lance plutot :
       .\make-organisateur-coupe-maison.ps1 -Pseudo "TonPseudo" )

3. A la fin tu dois voir :
       OK_ORGANISATEUR pseudo=Jean-Luc email=...
       APP_RESTARTED
       Termine.

4. Sur le site (coupe.arkkam.com) : **deconnecte-toi puis reconnecte-toi**.
5. Ouvre la page **"Mon compte"** : la partie **Organisateur**
   (liste des joueurs + bouton "Reinitialiser le mot de passe") doit apparaitre.

## Si ca coince
- "deploy-config.json introuvable" -> verifie que C:\Agile\deploy-config.json
  existe (c'est la cle SSH que tu utilises deja pour deployer).
- "compte introuvable" -> relance avec -Pseudo "le pseudo exact affiche sur le site".
- Rien ne change apres reconnexion -> envoie-moi la sortie complete du script.
