// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/SignUp';
import WelcomeAdmin from './components/WelcomeAdmin';
import GoodMorningUser from './components/GoodMorningUser';
import ScheduleQuiz from './components/ScheduleQuiz';
import QuizzesList from './components/QuizzesList';
import QuizAttempt from './components/QuizAttempt';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EditQuiz from './components/EditQuiz';
// Home component to redirect based on authentication status
const Home = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return currentUser.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />;
  } else {
    return <Navigate to="/login" />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute><WelcomeAdmin /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><GoodMorningUser /></ProtectedRoute>} />
          <Route path="/schedule-quiz" element={<ProtectedRoute><ScheduleQuiz /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizzesList /></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} />
          <Route path="/edit-quiz/:id" element={<ProtectedRoute><EditQuiz /></ProtectedRoute>} /> {/* Add the edit quiz route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
