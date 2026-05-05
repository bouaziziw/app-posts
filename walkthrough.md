# Walkthrough — Monorepo `app-posts` ✅

## Ce qui a été fait

Le projet `app-posts` a été migré vers un **monorepo npm workspaces** complet, avec une séparation claire des dépendances entre backend et frontend.

---

## Fichiers modifiés / créés

| Fichier | Action | Rôle |
|---|---|---|
| `package.json` | ✏️ Réécrit | Orchestrateur monorepo (workspaces + scripts centralisés) |
| `backend/package.json` | 🆕 Créé | Dépendances exclusivement backend (Express, Mongoose...) |
| `frontend/package.json` | ✏️ Modifié | Renommé en `@app-posts/frontend` |
| `.gitignore` | ✏️ Amélioré | Patterns `**/node_modules`, `**/dist` pour tous les workspaces |
| `.env.example` | 🆕 Créé | Template documenté des variables d'environnement |

---

## Structure finale du monorepo

```
app-posts/                          ← Racine du monorepo
├── package.json                    ← Orchestrateur (workspaces: backend, frontend)
├── package-lock.json               ← Lockfile unique pour tous les workspaces
├── node_modules/                   ← Dépendances dédupliquées centralisées
├── .gitignore                      ← Patterns monorepo
├── .env                            ← Variables d'environnement (non versionné)
├── .env.example                    ← Template des variables (versionné)
│
├── backend/                        ← @app-posts/backend
│   ├── package.json                ← Dépendances backend uniquement
│   ├── server.js
│   ├── config/ │ controllers/ │ middleware/ │ models/ │ routes/
│
└── frontend/                       ← @app-posts/frontend
    ├── package.json                ← Dépendances frontend uniquement
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
```

---

## Commandes disponibles

```bash
# Lancer backend + frontend en parallèle (avec couleurs distinctes)
npm run dev

# Lancer uniquement le backend (nodemon)
npm run dev:backend

# Lancer uniquement le frontend (Vite)
npm run dev:frontend

# Build de production du frontend
npm run build

# Linter du frontend
npm run lint

# Installer toutes les dépendances
npm install
```

---

## Résultat de la vérification (`npm ls --workspaces --depth=0`)

```
app-posts-monorepo@1.0.0
├─┬ @app-posts/backend@1.0.0  → ./backend
│ ├── bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, nodemailer, nodemon
└─┬ @app-posts/frontend@0.0.1 → ./frontend
  ├── react, react-dom, vite, typescript, tailwindcss, axios, redux, react-query...
```

---

## ⚠️ Points à noter

> [!WARNING]
> **Node.js v18 détecté** — Mongoose v9 requiert Node.js ≥ 20.19.0. Les warnings `EBADENGINE` sont bénins pour le développement, mais il est recommandé de mettre à jour Node.js avec `nvm install 20 && nvm use 20` pour la production.

> [!NOTE]
> **`concurrently`** est installé en `devDependency` à la racine. Il permet à `npm run dev` de lancer les deux serveurs en parallèle avec des préfixes colorés `[BACK]` et `[FRONT]`.

> [!TIP]
> Pour ajouter une dépendance à un workspace spécifique : `npm install <package> -w backend` ou `npm install <package> -w frontend`
