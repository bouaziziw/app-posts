import './App.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import Login from './components/Login';
import Register from './components/Register';
import { Toaster } from 'react-hot-toast';

function App() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Simple logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Posts App</h1>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModal('login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthModal('register')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
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

      {authModal === 'login' && (
        <Login
          onSwitchToRegister={() => setAuthModal('register')}
          onClose={() => setAuthModal(null)}
        />
      )}
      {authModal === 'register' && (
        <Register
          onSwitchToLogin={() => setAuthModal('login')}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

export default App;
