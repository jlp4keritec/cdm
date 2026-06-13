# Déploiement v0.8 — récap

Ce ZIP regroupe **les deux livraisons validées**, dans l'état final :

1. **Où regarder** — nouvelle page `/tv` (matchs par chaîne, 2 onglets M6/W9 et beIN)
   + lien « Où regarder » dans le menu.
2. **Parier** — menu « Paris » renommé en « PARIER » (bouton vert mis en avant)
   + l'aide « Prévision de victoire pour … » reste toujours affichée, même
   après validation. Bouton « Valider » d'origine.

## Étapes de déploiement

1. **Décompresser ce ZIP par-dessus `C:\Agile\coupe-maison`** (il remplace les
   fichiers modifiés et ajoute les nouveaux — l'arborescence est respectée).
2. (Conseillé) lancer une dernière fois en local et vérifier `/tv` + la page PARIER.
3. **Déployer** : ouvrir PowerShell dans `C:\Agile\coupe-maison` puis lancer le
   script habituel :
   ```powershell
   Unblock-File .\deploy-coupe-maison.ps1
   .\deploy-coupe-maison.ps1
   ```
4. **Vérifier en ligne** : https://coupe.arkkam.com
   - le menu affiche « Où regarder » et « PARIER » (en vert),
   - `https://coupe.arkkam.com/tv` ouvre la page des chaînes,
   - sur la page PARIER, l'aide reste visible après avoir validé un prono.

## Détails
Voir `CHANGELOG-ou-regarder.md` et `CHANGELOG-parier.md`.
