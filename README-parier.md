# Mise en avant des pronostics — « PARIER »

## Fonctions concernées
- `renderBetRow(m)` (`public/js/paris.js`) — chaque match à pronostiquer
  affiche **toujours** l'aide « Prévision de victoire pour … (xx %) » avec le ⓘ
  d'analyse, **y compris après avoir validé** son pronostic.

## Ce qui change
1. **Menu « Paris » → « PARIER »**, affiché en bouton vert bien visible sur
   toutes les pages.
2. **L'aide de pronostic reste toujours affichée**, même après validation
   (avant, elle disparaissait au profit d'un « ✓ enregistré »).

> Le bouton **« Valider »** n'a pas été modifié (taille et couleur d'origine).
> Modifier son score reste possible tant que le match n'a pas commencé : il
> suffit de changer le score et de re-valider.

## Fichiers
- `public/css/styles.css` — style `.nav-cta` (bouton PARIER).
- `public/*.html` — « Paris » → « PARIER ».
- `public/js/paris.js` — l'aide est toujours affichée sur les matchs à venir.
- `public/css/paris.css` — inchangé (bouton Valider d'origine).

## Installation
Décompresser le ZIP par-dessus `C:\Agile\coupe-maison`.

## Vérifié
- `node --check` OK sur `paris.js`.
