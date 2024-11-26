import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config'; // Import Firebase auth
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to Login page after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-container p-6 max-w-xl mx-auto mt-16 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-indigo-600">Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field p-3 border border-gray-300 rounded-md w-full shadow-md focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field p-3 border border-gray-300 rounded-md w-full shadow-md focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="submit-button bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <a href="/" className="text-blue-600">Login</a>
      </p>
    </div>
  );
};

export default SignUp;