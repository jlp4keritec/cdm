# README — Lien « Voir le résumé » 🔗

**Fonction concernée : `renderDoneRow` (page Paris, onglet "Mes paris passés")**
Date : 13/06/2026

## Ce qui change
Sur chaque match **terminé** de l'onglet « Mes paris passés », un petit
bouton « ▶ Voir le résumé » apparaît. Il ouvre, dans un nouvel onglet,
une recherche YouTube déjà remplie avec les deux équipes
(ex. « Qatar Suisse résumé Coupe du monde 2026 »).

En haut des résultats : la chaîne officielle FIFA et M6+. Gratuit, légal,
aucune vidéo hébergée chez toi — juste un lien sortant.

> Le lien n'apparaît que sur les matchs terminés (pas pendant le match
> ni avant). C'est voulu : pas de résumé tant que le match n'est pas fini.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `public\js\paris.js` | `C:\Agile\coupe-maison\public\js\paris.js` |
| `public\css\paris.css` | `C:\Agile\coupe-maison\public\css\paris.css` |

> ℹ️ Ces deux fichiers contiennent déjà tout le précédent (onglets,
> bouton Modifier, badge 🎯, compte à rebours, correctif déconnecté).

## Pour tester en local
1. Backup (ton `.bat`).
2. Colle les 2 fichiers, `npm start`, `Ctrl + F5` sur **Parier** > onglet
   « Mes paris passés ».
3. Sur un match terminé : clique « ▶ Voir le résumé » → la recherche
   YouTube s'ouvre dans un nouvel onglet.
