# App Posts - Full Stack Setup Guide

This is a complete full-stack Posts management application with a Node.js/Express backend and a React 19 frontend.

## Project Structure

```
app-posts/
├── backend/                    # Node.js/Express API
│   ├── controllers/
│   │   └── post.controller.js  # CRUD logic
│   ├── models/
│   │   └── post.model.js       # MongoDB schema
│   ├── routes/
│   │   └── post.routes.js      # API routes
│   ├── config/
│   │   └── db.js               # Database config
│   ├── server.js               # Express app
│   └── package.json
│
└── frontend/                   # React 19 application
    ├── src/
    │   ├── components/         # React components
    │   ├── hooks/              # Custom React hooks (TanStack Query)
    │   ├── services/           # API client
    │   ├── store/              # Redux Toolkit store
    │   ├── types/              # TypeScript interfaces
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css           # Tailwind styles
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ (tested with v18.19.1)
- npm 9+
- MongoDB running locally or remote connection

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/app-posts
PORT=5000
```

3. Start the server:
```bash
npm run server
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will open at `http://localhost:3000`

## Backend Features

- REST API for CRUD operations on posts
- MongoDB integration with Mongoose
- User-specific like/dislike system
- Error handling and validation
- CORS support (can be enabled in server.js)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/post` | Get all posts |
| POST | `/post` | Create new post |
| PUT | `/post/:id` | Update post |
| DELETE | `/post/:id` | Delete post |
| PATCH | `/post/like-post/:id` | Like a post |
| PATCH | `/post/dislike-post/:id` | Dislike a post |

### Backend Dependencies

- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - CORS middleware

## Frontend Features

- **CRUD Operations** - Full Create, Read, Update, Delete functionality
- **Real-time Updates** - Posts sync automatically after mutations
- **User Likes** - Track which users have liked posts
- **Modern Stack** - React 19, TypeScript, Tailwind CSS
- **State Management** - Redux Toolkit for UI state
- **Data Fetching** - TanStack Query for server state management
- **Forms** - React Hook Form for efficient form handling

### Frontend Dependencies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state management
- **React Hook Form** - Form management
- **Redux Toolkit** - UI state management
- **Axios** - HTTP client

## Development Workflow

### Running Both Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
# Backend is ready to deploy as-is
npm run server  # or use a process manager like pm2
```

**Frontend:**
```bash
npm run build    # Creates dist folder
npm run preview  # Preview production build
```

## Key Features Explained

### 1. Creating Posts
- Click "Create New Post" button
- Fill in author name and message
- Submit form
- Post appears immediately in the list

### 2. Updating Posts
- Click "Edit" on any post
- Modal opens with current post data
- Update and save
- List updates automatically

### 3. Deleting Posts
- Click "Delete" button
- Confirm deletion
- Post is removed from list

### 4. Liking/Disliking Posts
- Click heart icon to like/unlike
- User ID is tracked (defaults to "user123")
- Like count updates in real-time

## State Management Architecture

### Redux Store (UI State)
```
ui:
  - isLoading: boolean
  - error: string | null
  - successMessage: string | null
  - currentUserId: string
```

### TanStack Query (Server State)
```
posts: Post[] - fetched from GET /post
- Auto-refetch after mutations
- 5 minute cache time
- Automatic error handling
```

## API Request/Response Examples

### Create Post
```
POST /post
{
  "message": "Hello world!",
  "author": "John Doe"
}

Response:
{
  "_id": "69f24492acf9f3a392c2ec51",
  "message": "Hello world!",
  "author": "John Doe",
  "likers": [],
  "createdAt": "2024-04-30T10:00:00Z",
  "updatedAt": "2024-04-30T10:00:00Z"
}
```

### Like Post
```
PATCH /post/like-post/69f24492acf9f3a392c2ec51
{
  "userId": "user123"
}

Response:
{
  "_id": "69f24492acf9f3a392c2ec51",
  "message": "Hello world!",
  "author": "John Doe",
  "likers": ["user123"],
  ...
}
```

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check if MongoDB is running
- Look for CORS errors in browser console

### Posts not loading
- Check backend logs for errors
- Verify MongoDB connection
- Ensure database has data or create a test post

### Like/Dislike returns 404
- Verify the post ID is valid
- Check backend route definition
- Ensure userId is being sent in request body

### TypeScript errors
- Run `npm install` in frontend to ensure types are installed
- Check that all imports are correct
- Verify tsconfig.json settings

## Future Enhancements

- Authentication system
- User profiles
- Comments on posts
- Search and filter
- Tags/categories
- Pagination
- Real-time notifications with WebSocket
- Image uploads
- Draft posts
- Post scheduling

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## License

MIT

---

**Created:** April 30, 2026
**Last Updated:** April 30, 2026
