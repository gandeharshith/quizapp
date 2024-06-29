// src/components/QuizDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const QuizDetails = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
        if (quizDoc.exists()) {
          setQuiz(quizDoc.data());
        } else {
          console.error('Quiz not found');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{quiz.title}</h2>
        {score === null ? (
          <form onSubmit={handleSubmitQuiz}>
            {quiz.questions.map((question) => (
              <div key={question.id} className="mb-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-700">{question.text}</h4>
                {question.options.map((option, index) => (
                  <label key={`${question.id}-${index}`} className="block">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={userAnswers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            <button type="button" onClick={handleSubmitQuiz} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Submit Quiz
            </button>
          </form>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Your Score: {score} / {quiz.questions.length}</h3>
            <button onClick={() => navigate('/user')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Back to Quizzes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
