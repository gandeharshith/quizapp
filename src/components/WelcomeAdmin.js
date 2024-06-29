// src/components/WelcomeAdmin.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const WelcomeAdmin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'quizzes'));
        const quizzesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
      console.log('Quiz deleted successfully');
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome, Admin</h2>
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <Link 
            to="/schedule-quiz" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Schedule a Quiz
          </Link>
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Quizzes Created:</h3>
        <ul className="space-y-4">
          {quizzes.map(quiz => (
            <li 
              key={quiz.id} 
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-sm"
            >
              <span className="text-lg text-gray-800">{quiz.title}</span>
              <div>
                <Link 
                  to={`/edit-quiz/${quiz.id}`} 
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDeleteQuiz(quiz.id)} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WelcomeAdmin;
