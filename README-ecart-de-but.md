# 🎯 Nouvelle règle : le « bon écart de but » (2 pts)

## Fonction livrée : `pointsFor` (data/bets.js)

Un palier intermédiaire a été ajouté entre le score exact (3 pts) et le bon
vainqueur (1 pt) : **2 pts** quand tu trouves le **bon écart de but**.

## La grille complète

| Ce que tu réussis | Points |
|---|---|
| Le **score exact** | **3 pts** |
| Le bon **écart de but** (y compris un nul) | **2 pts** |
| Le bon vainqueur, mais le mauvais écart | **1 pt** |
| Tu te trompes de résultat | **0 pt** |

### Exemple — vrai score 3-1
- **3-1** → score exact → **3 pts**
- **2-0** / **4-2** → bon écart (2 buts) → **2 pts**
- **2-1** → bon vainqueur, écart de 1 → **1 pt**
- **1-3** → mauvais vainqueur → **0 pt**

### Le match nul
Un nul, c'est un écart de 0. Si tu prévois un nul et qu'il y a nul :
- score exact (ex. 1-1 deviné 1-1) → **3 pts**
- nul non exact (ex. 1-1 deviné 2-2) → **2 pts** (l'écart 0 est trouvé)

## Ce qui ne change PAS
- Mode **Quitte ou double** : le bon écart compte comme un bon résultat (×1,5).
- Mode **Joker**.

## Fichiers modifiés
- `data/bets.js` — la règle de calcul (`pointsFor`).
- `server.js` — le bon écart est compté parmi les « bons résultats ».
- `public/js/palmares.js` — le détail affiche « 🎯 2 pts ».
