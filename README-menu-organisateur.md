# Bouton "Organisateur" dans le menu

## Ce que ca change
Quand TU es connecte (en tant qu'organisateur), un lien **"⚙️ Organisateur"**
apparait dans le menu du haut. Il mene a la page de gestion des comptes
(/compte) ou tu peux reinitialiser les mots de passe des joueurs.
- Ce lien n'apparait QUE pour l'organisateur. Les autres joueurs ne le voient pas.
- Plus besoin de taper l'adresse a la main.

## Fonction livree
- `public/js/auth.js` : ajoute le lien "Organisateur" dans la barre du menu
  lorsque le compte connecte est l'organisateur.

## Fichier modifie (a coller en respectant l'arborescence)
- public/js/auth.js   (remplace l'ancien)

## Etapes
1. Decompresse ce ZIP a la racine de C:\Agile\coupe-maison
   -> il remplace public/js/auth.js (l'arborescence est respectee).
2. Redeploie le site (mise a jour de code uniquement, sans toucher nginx/SSL) :

       cd C:\Agile\coupe-maison
       .\deploy-coupe-maison.ps1 -SkipNginx -SkipCertbot

3. Sur le site : recharge avec Ctrl+F5 (pour vider le cache).
4. Tu dois voir le lien **"⚙️ Organisateur"** dans le menu du haut.
   Clique dessus -> tu arrives sur l'espace organisateur.

## Si tu ne vois pas le lien
- Fais bien Ctrl+F5 (le navigateur garde l'ancien menu en cache).
- Verifie que tu es bien connecte en Jean-Luc.
