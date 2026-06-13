# README — Correctif alignement du titre de la page Stats

**Fichier concerné : `public/css/stats.css`**
Date : 13/06/2026

## Le problème (ta capture)
Le titre « Le coin rigolo / Stats fun / … » était collé à gauche au lieu
d'être centré comme sur les autres pages.

## La cause
Le style qui centre l'en-tête vivait dans `competition.css`, que la page
Stats ne charge pas.

## Le correctif
Le centrage de l'en-tête est maintenant inclus directement dans
`stats.css`. Le titre s'affiche centré, comme Palmarès.

## Fichier livré (complet)
| Fichier | Destination |
|---|---|
| `public\css\stats.css` | `C:\Agile\coupe-maison\public\css\stats.css` |

## Pour tester en local
1. Colle le fichier, `Ctrl + F5` sur la page **Stats**.
2. Le titre et le sous-titre sont centrés.
