# README — Compte à rebours « plus que Xh pour parier » ⏳

**Fonction concernée : `refreshCountdowns` (page Paris)**
Date : 13/06/2026

## Ce qui change
Sur la page **Parier**, onglet « À pronostiquer », chaque match dont le coup
d'envoi est dans **moins de 24 h** affiche un compte à rebours qui se met à
jour tout seul (toutes les 30 secondes) :

- plus d'1 h → « ⏳ plus que 3h 12min pour parier » (en bleu) ;
- moins d'1 h → orange ;
- moins de 10 min → rouge clignotant (doux) ;
- coup d'envoi atteint → « ⏳ trop tard » (le match part dans l'onglet
  « Mes paris passés » au rechargement suivant).

Les matchs à plus de 24 h n'affichent rien (pour ne pas surcharger).
Tout est calculé dans le navigateur : aucune donnée ni serveur modifié.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `public\js\paris.js` | `C:\Agile\coupe-maison\public\js\paris.js` |
| `public\css\paris.css` | `C:\Agile\coupe-maison\public\css\paris.css` |

> ℹ️ Ces deux fichiers contiennent déjà tout ce qui a été livré avant
> (onglets, bouton Valider/Modifier, badge 🎯, correctif déconnecté).
> Tu peux les coller sans crainte, rien ne régresse.

## Pour tester en local
1. Backup (ton `.bat`).
2. Colle les 2 fichiers, `npm start`, `Ctrl + F5` sur la page **Parier** (connecté).
3. Sur un match du jour (< 24 h), le compte à rebours apparaît et défile.

> Astuce : si aucun match n'est dans les 24 h, le compte à rebours ne
> s'affiche pour aucun — c'est normal.
