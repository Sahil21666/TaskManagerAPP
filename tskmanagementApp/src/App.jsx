import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TaskManager from './components/TaskManager';
import Header from './components/Header'; // Import Header

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    
      <div>
       
        {<Header user={user} />}

        <Routes>
          {/* Redirect authenticated users to /tasks */}
          <Route path="/" element={user ? <Navigate to="/tasks" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/tasks" /> : <SignUp />} />
          {/* Tasks route is protected for authenticated users */}
          <Route path="/tasks" element={user ? <TaskManager /> : <Navigate to="/" />} />
        </Routes>

        
      </div>
      
    
  );
}

export default App;