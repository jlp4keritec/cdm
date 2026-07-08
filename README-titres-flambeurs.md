# 🔥 Stats fun — 5 nouveaux titres pour les modes spéciaux

## À quoi ça sert
Avec le Quitte ou double et le Joker, certains joueurs misent gros et sortent
des paris classiques. Les Stats fun ne les mettaient pas en valeur. On ajoute
**5 titres** dédiés à ces flambeurs.

## Les nouveaux titres

| Titre | Le gagnant est celui qui… |
|---|---|
| 🔥 **Le Casino** | a misé le plus de points au total (qod + joker) |
| 💰 **Le Gros Coup** | a fait la plus grosse victoire sur **un seul** pari |
| 🃏 **Le Joueur** | a placé le plus de paris en mode spécial |
| 📉 **Le Cramé** | a perdu le plus de points (cumul des paris perdants) |
| 🧨 **Le Rentable** | a le meilleur bilan net (gains − pertes) |

> Seuls les paris **déjà joués** comptent pour le Gros Coup, le Cramé et le
> Rentable. Tant qu'il n'y a pas de pari spécial, la carte affiche « — ».

## Où ça apparaît
- Page **Stats fun** (`/stats`) : 5 cartes en plus (10 titres au total).
- Page d'**accueil** : une carte « Quoi de neuf ? » qui renvoie vers `/stats`.

## Fichiers modifiés
- `server.js` — calcul des 5 titres dans la route `/api/stats`.
- `public/js/stats.js` — affichage des 5 nouvelles cartes.
- `public/index.html` — nouvelle carte d'accueil.

## Rien ne change par ailleurs
Aucune nouvelle dépendance, aucune donnée à migrer. Les règles de points et les
modes de pari restent identiques.
