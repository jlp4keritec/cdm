# README — Page Paris : onglet « Mes paris passés »

**Fonctions livrées : `showTab` (onglets) et `renderDoneRow` (affichage d'un pari passé)**
Date : 13/06/2026

## Ce qui change

La page Paris a maintenant **deux onglets**, comme la page Compétition :

- **À pronostiquer** : les matchs à venir, inchangé.
- **Mes paris passés** : pour chaque match commencé ou terminé —
  - ton pari en **lecture seule** (« Ton pari : 2 - 1 »), impossible à modifier ;
  - le **score réel** avec son libellé « Score final » (ou « En cours » pendant le match) ;
  - les **points gagnés** : +3 (score exact), +1 (bon résultat), +0, ou « en attente »
    tant que le match n'est pas fini.

Avant, cette liste existait mais tout en bas de la page, sous la centaine de
matchs à pronostiquer — donc introuvable. Maintenant elle a son onglet.

Si un onglet est vide, un message clair s'affiche à la place.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `public\paris.html` | `C:\Agile\coupe-maison\public\paris.html` |
| `public\js\paris.js` | `C:\Agile\coupe-maison\public\js\paris.js` |
| `public\css\paris.css` | `C:\Agile\coupe-maison\public\css\paris.css` |

## Pour tester en local

1. Colle les 3 fichiers (remplace les existants).
2. `npm start` puis `Ctrl + F5` sur la page **Parier** (connecté).
3. Vérifie : deux onglets en haut ; dans « Mes paris passés », les matchs
   des 11-12 juin avec score réel, ton pari et les points.

⚠️ Backup (ton `.bat`) avant de coller les fichiers.
