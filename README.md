

# Monorepo Backend + Frontend — `app-posts`

## Context & Objective

The `app-posts` project already contains two folders, `backend/` and `frontend/`, but suffered from a structural problem:
- A single root `package.json` mixing backend dependencies (Express, Mongoose...) and frontend dependencies (React, Redux...)
- No clear separation of responsibilities between the two workspaces
- The root `dev` command only launched the backend

The objective was to convert the project into a **clean monorepo** using **npm workspaces**, allowing:
- Total isolation of dependencies for each workspace
- Centralized scripts from the root (`dev`, `build`, `lint`...)
- A single, deduplicated `node_modules` folder at the root (saving space)
- Optional shared configuration (ESLint, Prettier, TypeScript)


## Tech Stack

- **React 19** - Latest React framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching library
- **React Hook Form** - Performant form handling
- **Redux Toolkit** - Modern Redux with simplified API
- **Axios** - HTTP client for API calls

## Features

- ✨ **Create Posts** - Add new posts with author and message
- 📝 **Update Posts** - Edit existing posts
- 🗑️ **Delete Posts** - Remove posts
- 👍 **Like/Dislike** - Toggle likes on posts with user-specific tracking
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- ⚡ **State Management** - Redux Toolkit for UI state
- 📡 **Data Fetching** - TanStack Query for server state
- 📋 **Form Handling** - React Hook Form for efficient form management
- 🔄 **Real-time Updates** - Automatic data synchronization with backend

---

## Target Structure

```
app-posts/                        ← Monorepo Root
├── package.json                  ← [MODIFY] Orchestrator (workspaces + scripts)
├── .gitignore                    ← [MODIFY] Improved for the monorepo
├── .env.example                  ← [NEW] Environment variables template
├── README.md                     ← [MODIFY] Monorepo documentation
│
├── backend/                      ← Backend workspace (Express + MongoDB)
│   ├── package.json              ← [NEW] Backend-specific dependencies
│   ├── .env                      ← (existing, unversioned)
│   ├── server.js                 ← (existing)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
└── frontend/                     ← Frontend workspace (React + Vite + TS)
    ├── package.json              ← [MODIFY] Nettoyé et aligné
    ├── vite.config.ts            ← (existant)
    └── src/
    ├── components/          # React components
    │   ├── CreatePost.tsx   # Form for creating new posts
    │   ├── PostCard.tsx     # Individual post display card
    │   ├── PostList.tsx     # List of all posts
    │   └── UpdatePost.tsx   # Modal for updating posts
    ├── hooks/
    │   └── usePostsQuery.ts # Custom hooks for TanStack Query
    ├── services/
    │   └── api.ts          # API client and endpoints
    ├── store/
    │   ├── index.ts        # Redux store configuration
    │   └── uiSlice.ts      # Redux slice for UI state
    ├── types/
    │   └── Post.ts         # TypeScript interfaces
    ├── App.tsx             # Main app component
    ├── App.css             # App styles
    ├── main.tsx            # Entry point
    └── index.css           # Global styles with Tailwind
```


---

## Available Commands

```bash
# Run backend + frontend in parallel (with distinct colors)
npm run dev

# Run only the backend (nodemon)
npm run dev:backend

# Run only the frontend (Vite)
npm run dev:frontend

# Production build for the frontend
npm run build

# Lint the frontend
npm run lint

# Install all dependencies
npm install
```

---

## Verification Result (`npm ls --workspaces --depth=0`)

```
app-posts-monorepo@1.0.0
├─┬ @app-posts/backend@1.0.0  → ./backend
│ ├── bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, nodemailer, nodemon
└─┬ @app-posts/frontend@0.0.1 → ./frontend
  ├── react, react-dom, vite, typescript, tailwindcss, axios, redux, react-query...
```

---

## API Integration

The app communicates with the backend API at `http://localhost:5000`. Make sure the backend server is running before starting the frontend.

### API Endpoints Used:

- `GET /post` - Get all posts
- `POST /post` - Create a new post
- `PUT /post/:id` - Update a post
- `DELETE /post/:id` - Delete a post
- `PATCH /post/like-post/:id` - Like a post
- `PATCH /post/dislike-post/:id` - Dislike a post

## Features Explained

### Creating Posts
Click the "Create New Post" button to open a form. Fill in your name and message, then submit.

### Updating Posts
Click the "Edit" button on any post to update its content.

### Deleting Posts
Click the "Delete" button to remove a post (with confirmation).

### Liking/Disliking Posts
Click the heart icon to toggle your like status. The like count updates in real-time.

## State Management

- **Redux Toolkit** manages UI state (loading, errors, success messages, current user)
- **TanStack Query** manages server state (posts data)
- Automatic cache invalidation and refetching after mutations

## Form Validation

Forms use React Hook Form with:
- Required field validation
- Real-time error display
- Optimized re-renders

## Styling

Built entirely with Tailwind CSS for a consistent, modern design.

## Environment Variables

Create a `.env` file if needed:

```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Posts not loading?
- Ensure the backend server is running on port 5000
- Check browser console for CORS issues
- Verify the API endpoints are correct

### Like/Dislike not working?
- Ensure the backend dislike endpoint is correctly configured
- Check that the user ID is being sent in the request
- Verify the post ID in the URL is correct

## License

MIT
