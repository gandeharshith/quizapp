// src/components/GoodMorningUser.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const GoodMorningUser = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Good Morning!</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <p className="text-lg mb-6 text-gray-600">Here are the available quizzes:</p>
        <ul className="space-y-4">
          {quizzes.map(quiz => (
            <li key={quiz.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100">
              <Link to={`/quiz/${quiz.id}`} className="text-blue-500 hover:underline">
                {quiz.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoodMorningUser;
