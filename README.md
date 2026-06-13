# Coupe à la maison ⚽

Petit jeu de pronostics entre amis pour la Coupe du Monde 2026.
Chacun prédit le score des matchs, marque des points et grimpe au classement.

> Bon résultat = 1 point · Score exact = 3 points

## Fonctionnalités

- Comptes joueurs (avec un rôle « organisateur »)
- Page de paris avec onglets « À pronostiquer » / « Mes paris passés »
- Compte à rebours avant chaque match
- Classement (palmarès) avec flèches d'évolution
- Badge « pari exact » 🎯
- Page « Stats fun » (titres rigolos décernés d'après les paris)
- Lien vers les résumés vidéo des matchs
- Pages compétition, équipes, « où regarder »

## Technologies

- Node.js / Express
- PM2 (gestion du processus en production)
- nginx (reverse proxy) + Let's Encrypt (HTTPS)
- Stockage simple en fichiers JSON
- Données des matchs : API football-data.org

## Installation en local

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env à partir de l'exemple
#    puis remplir les deux clés
cp .env.example .env

# 3. Lancer le site
npm start
```

Le site démarre sur http://localhost:3000

## Configuration (.env)

| Variable | Rôle |
|---|---|
| `FOOTBALL_API_KEY` | Clé d'accès à football-data.org |
| `SESSION_SECRET` | Clé de sécurité des sessions |

> ⚠️ Le fichier `.env` et les fichiers de `data/` (comptes, paris) sont
> privés et **ne sont pas** versionnés (voir `.gitignore`).

## Licence

Projet personnel entre amis.
