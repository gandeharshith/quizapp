// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/SignUp';
import WelcomeAdmin from './components/WelcomeAdmin';
import GoodMorningUser from './components/GoodMorningUser';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<ProtectedRoute><WelcomeAdmin /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><GoodMorningUser /></ProtectedRoute>} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
