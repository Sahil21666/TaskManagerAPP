import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <header className="bg-indigo-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* App Logo */}
        <h1
          className="text-xl font-bold cursor-pointer hover:text-indigo-200 transition"
          onClick={() => navigate(user ? '/tasks' : '/')}
        >
          TaskManager
        </h1>

        {/* Navigation Links */}
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="hidden md:inline">
                Welcome, <strong>{user?.email || 'Guest'}</strong>
              </span>

              <button
                onClick={() => navigate('/tasks')}
                className="hover:text-indigo-200 transition"
              >
                Tasks
              </button>

              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 py-1 px-4 rounded-lg shadow-md hover:bg-indigo-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/')}
                className="hover:text-indigo-200 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-indigo-600 py-1 px-4 rounded-lg shadow-md hover:bg-indigo-100 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;