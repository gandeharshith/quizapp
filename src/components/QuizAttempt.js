// src/components/QuizAttempt.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const { currentUser } = useAuth();
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
      if (quizDoc.exists()) {
        setQuiz(quizDoc.data());
      } else {
        console.log('No such document!');
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let calculatedScore = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);

    try {
      await addDoc(collection(db, 'responses'), {
        quizId,
        userId: currentUser.uid,
        answers: Object.keys(answers).map(questionIndex => ({
          questionId: questionIndex,
          selectedOption: answers[questionIndex],
        })),
        score: calculatedScore,
        submittedAt: Timestamp.now(),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105">
        {quiz ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-800 animate-pulse">{quiz.title}</h2>
            {quiz.questions.map((question, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4 transform transition-all duration-300 hover:shadow-lg hover:bg-gray-100">
                <p className="text-xl text-gray-800">{question.questionText}</p>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={`q${index}o${oIndex}`}
                      name={`question${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      required
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full"
                    />
                    <label htmlFor={`q${index}o${oIndex}`} className="text-gray-700 text-lg">{option}</label>
                  </div>
                ))}
              </div>
            ))}
            <button 
              type="submit"
              className="w-full py-3 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
            >
              Submit Quiz
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-200 text-lg animate-bounce">Loading...</p>
        )}
        {score !== null && (
          <div className="relative">
            <p className="text-center text-2xl mt-4 text-gray-800 animate-fadeIn">
              Your score: {score}/{quiz.questions.length}
            </p>
            {score === quiz.questions.length && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                <Confetti width={width} height={height} />
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-75 flex flex-col items-center justify-center">
                  <h2 className="text-5xl font-bold text-purple-800 mb-4 animate-bounce">Congratulations!</h2>
                  <p className="text-2xl text-gray-700 animate-fadeIn">You achieved a perfect score!</p>
                </div>
              </div>
            )}
            {score === 0 && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-6xl text-red-500 animate-grow">💀</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
