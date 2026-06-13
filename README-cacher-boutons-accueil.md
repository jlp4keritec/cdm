# README — Accueil : cacher les boutons quand on est connecté

**Fonction concernée : état de connexion (`auth.js`)**
Date : 13/06/2026

## Ce qui change
Les deux boutons « Créer mon compte » et « Voir la compétition » sous le
titre d'accueil disparaissent **quand tu es connecté** (tu n'en as plus
besoin). Ils restent visibles pour les visiteurs non connectés, pour ne
pas perdre de nouveaux inscrits.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `public\index.html` | `C:\Agile\coupe-maison\public\index.html` |
| `public\js\auth.js` | `C:\Agile\coupe-maison\public\js\auth.js` |

> ℹ️ `index.html` contient déjà la section « Quoi de neuf ? » et le compte
> à rebours du prochain match livrés juste avant. Rien ne régresse.

## Pour tester en local
1. Backup (ton `.bat`).
2. Colle les 2 fichiers, `npm start`, `Ctrl + F5` sur l'**Accueil**.
3. Connecté → les 2 boutons ont disparu. Déconnecté (navigation privée)
   → ils sont toujours là.
