# Monorepo Backend + Frontend — `app-posts`

## Contexte & Objectif

Le projet `app-posts` possède déjà deux dossiers `backend/` et `frontend/`, mais souffre d'un problème de structure :
- Un seul `package.json` racine qui mélange les dépendances backend (Express, Mongoose...) et frontend (React, Redux...)
- Aucune séparation claire des responsabilités entre les deux workspaces
- La commande `dev` dans la racine ne lance que le backend

L'objectif est de convertir le projet en **monorepo propre** avec **npm workspaces**, permettant :
- Une isolation totale des dépendances de chaque workspace
- Des scripts centralisés depuis la racine (`dev`, `build`, `lint`...)
- Un seul `node_modules` dédupliqué à la racine (gain de place)
- Une configuration partagée (ESLint, Prettier, TypeScript) optionnelle

---

## Structure Cible

```
app-posts/                        ← Racine du monorepo
├── package.json                  ← [MODIFY] Orchestrateur (workspaces + scripts)
├── .gitignore                    ← [MODIFY] Amélioré pour le monorepo
├── .env.example                  ← [NEW] Template des variables d'environnement
├── README.md                     ← [MODIFY] Documentation monorepo
│
├── backend/                      ← Workspace backend (Express + MongoDB)
│   ├── package.json              ← [NEW] Dépendances propres au backend
│   ├── .env                      ← (existant, non versionné)
│   ├── server.js                 ← (existant)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
└── frontend/                     ← Workspace frontend (React + Vite + TS)
    ├── package.json              ← [MODIFY] Nettoyé et aligné
    ├── vite.config.ts            ← (existant)
    └── src/
```

---

## Proposed Changes

### 1. Racine du Monorepo

#### [MODIFY] `package.json` (racine)
Transformer en **orchestrateur de workspaces** pur :
- Déclarer `"workspaces": ["backend", "frontend"]`
- Supprimer toutes les dépendances métier (elles vont dans leurs workspaces respectifs)
- Ajouter des scripts `--workspace` pour lancer les deux serveurs en parallèle avec `concurrently`

```json
{
  "name": "app-posts-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "dev":           "concurrently \"npm run dev -w backend\" \"npm run dev -w frontend\"",
    "dev:backend":   "npm run dev -w backend",
    "dev:frontend":  "npm run dev -w frontend",
    "build":         "npm run build -w frontend",
    "lint":          "npm run lint -w frontend",
    "install:all":   "npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

#### [NEW] `.env.example`
Modèle documenté des variables d'environnement requis par le backend.

#### [MODIFY] `.gitignore`
Ajouter les patterns spécifiques au monorepo.

---

### 2. Workspace Backend

#### [NEW] `backend/package.json`
Isoler **uniquement** les dépendances du serveur Express :
```json
{
  "name": "@app-posts/backend",
  "version": "1.0.0",
  "scripts": {
    "dev":   "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs":    "^3.0.3",
    "cors":        "^2.8.6",
    "dotenv":      "^17.4.2",
    "express":     "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose":    "^9.5.0",
    "nodemailer":  "^8.0.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

### 3. Workspace Frontend

#### [MODIFY] `frontend/package.json`
- Renommer en `@app-posts/frontend` (convention de scope monorepo)
- Garder toutes les dépendances existantes (React, Vite, TailwindCSS, Redux, etc.)
- Aucun changement fonctionnel, juste l'alignement avec les conventions monorepo

---

## Plan d'exécution (étapes)

| # | Action | Détail |
|---|--------|--------|
| 1 | Créer `backend/package.json` | Extraire les dépendances backend depuis la racine |
| 2 | Modifier `frontend/package.json` | Renommer en scope `@app-posts/frontend` |
| 3 | Réécrire `package.json` racine | Orchestrateur workspaces + `concurrently` |
| 4 | Mettre à jour `.gitignore` | Patterns monorepo |
| 5 | Créer `.env.example` | Template variables d'environnement |
| 6 | Supprimer l'ancien `node_modules` racine | Éviter les conflits |
| 7 | Lancer `npm install` | Réinstaller proprement avec workspaces |
| 8 | Vérifier `npm run dev` | Les deux serveurs doivent démarrer |

---

## Vérification

### Tests automatiques
```bash
# Vérifier la structure des workspaces
npm ls --workspaces

# Lancer le backend seul
npm run dev:backend

# Lancer le frontend seul
npm run dev:frontend

# Lancer les deux en parallèle
npm run dev
```

### Points de validation
- [ ] `backend/node_modules` n'existe **pas** (dépendances dans la racine)
- [ ] `npm run dev` lance les deux serveurs avec des couleurs distinctes via `concurrently`
- [ ] Le frontend Vite démarre sur `http://localhost:5173`
- [ ] Le backend Express démarre sur le port défini dans `.env`

---

## ⚠️ Points d'attention

> [!WARNING]
> Le `backend/.env` est déjà présent mais n'est **pas versionné** (c'est bien). Il faudra le conserver en place.

> [!IMPORTANT]
> Après le `npm install` monorepo, les dépendances partagées (ex: `axios`) seront **dédupliquées** automatiquement dans le `node_modules` racine.

> [!NOTE]
> Le `frontend` a son propre `node_modules` parce que Vite en a besoin localement. C'est normal dans npm workspaces.
