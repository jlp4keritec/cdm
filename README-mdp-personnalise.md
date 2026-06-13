# README — Espace organisateur : liste lisible + mot de passe personnalisé

**Fonctions livrées : `loadAdminUsers` (liste corrigée) et `/api/admin/reset` (mot de passe personnalisé)**
Date : 13/06/2026

## Ce qui change

### 1. Liste des participants lisible 🎨
La liste déroulante « Participant » de l'Espace organisateur affichait du texte
noir sur fond sombre. Elle a maintenant un fond uni et des couleurs forcées :
- thème **sombre** : fond bleu nuit, texte blanc ;
- thème **clair** : fond blanc, texte foncé.

### 2. Mot de passe personnalisé 🔑
Un nouveau champ « **Nouveau mot de passe (optionnel)** » apparaît sous la liste :
- **rempli** → c'est ce mot de passe qui est appliqué (minimum 8 caractères,
  comme à l'inscription) et l'encadré affiche « Mot de passe choisi » ;
- **vide** → un mot de passe est généré automatiquement, comme avant.

### 3. Au passage (sécurité, rien de visible)
Les pseudos/emails affichés dans la liste sont maintenant « échappés » :
un pseudo contenant des caractères spéciaux ne peut plus perturber la page.
Aucun changement visible, aucune fonctionnalité ajoutée.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `server.js` | `C:\Agile\coupe-maison\server.js` |
| `public\compte.html` | `C:\Agile\coupe-maison\public\compte.html` |
| `public\js\compte.js` | `C:\Agile\coupe-maison\public\js\compte.js` |
| `public\css\compte.css` | `C:\Agile\coupe-maison\public\css\compte.css` |

## Pour tester en local

1. Colle les 4 fichiers (remplace les existants).
2. Relance le site : `npm start`
3. Dans le navigateur : `Ctrl + F5` sur la page **Mon compte** (connecté en organisateur).
4. Vérifie : la liste est lisible, et essaie une réinitialisation
   avec un mot de passe tapé, puis une avec le champ vide.

⚠️ Pense à faire un **backup** (ton `.bat`) avant de coller les fichiers.
