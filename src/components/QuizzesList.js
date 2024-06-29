// src/components/QuizzesList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const QuizzesList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizzesData);
    };
    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2>Available Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizzesList;
