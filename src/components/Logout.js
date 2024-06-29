// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
