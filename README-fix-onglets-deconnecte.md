# README — Correctif : onglets cachés quand on est déconnecté

**Fonction concernée : affichage de la page Paris (`load`)**
Date : 13/06/2026

## Le problème (ta capture)
Déconnecté, la page Paris affichait à la fois le message « Connecte-toi »,
le badge « 0 points » et les deux onglets vides.

## La cause
Le style des onglets et du badge (`display: flex`) passait au-dessus de
l'attribut `hidden` qui sert à les cacher.

## Le correctif
Quelques lignes ajoutées à la fin de `public/css/paris.css` : un élément
marqué `hidden` est maintenant vraiment caché. Déconnecté, on ne voit plus
que le message « Connecte-toi ». Connecté, rien ne change.

## Fichier livré (complet)
| Fichier | Destination |
|---|---|
| `public\css\paris.css` | `C:\Agile\coupe-maison\public\css\paris.css` |
