import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tasks'); // Redirect to tasks page after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-16 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-500 text-white rounded mb-4"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/signup')}
        className="w-full p-2 bg-gray-500 text-white rounded"
      >
        Don't have an account? Sign Up
      </button>
    </div>
  );
};

export default Login;