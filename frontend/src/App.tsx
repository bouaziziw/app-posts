import './App.css';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Posts App</h1>
          <p className="text-gray-600 mt-2">Manage your posts with ease</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <CreatePost />
        <PostList />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 Posts App. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
