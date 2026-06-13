# README — Accueil : section Nouveautés + compte à rebours du prochain match

**Fonctions concernées : `loadNextMatch` / `updateCountdown` (accueil)**
Date : 13/06/2026

## Ce qui change

### 1. Section « Quoi de neuf ? »
Sous les boutons d'accueil, 4 cartes présentent les nouveautés du Lot 1 :
🎯 badge pari exact · ⏳ compte à rebours · ↕️ classement vivant · ▶️ résumés
vidéo. Chaque carte mène à la bonne page (Parier ou Palmarès).

### 2. Compte à rebours « vivant »
Le compte à rebours de l'accueil ne vise plus le 11 juin (déjà passé) mais
le **prochain match à venir**, récupéré automatiquement. Le texte dessous
indique les équipes (ex. « avant France - Sénégal »). Quand tous les
matchs connus sont joués, il affiche un message d'attente.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `public\index.html` | `C:\Agile\coupe-maison\public\index.html` |
| `public\js\main.js` | `C:\Agile\coupe-maison\public\js\main.js` |
| `public\css\home-news.css` *(nouveau)* | `C:\Agile\coupe-maison\public\css\home-news.css` |

> ℹ️ `home-news.css` est un nouveau petit fichier : le gros `styles.css`
> commun n'est pas touché.

## Pour tester en local
1. Backup (ton `.bat`).
2. Colle les 3 fichiers, `npm start`, `Ctrl + F5` sur l'**Accueil**.
3. Vérifie : le compte à rebours indique le prochain match (avec les
   équipes dessous), et la section « Quoi de neuf ? » s'affiche.
