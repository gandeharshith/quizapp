import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', id));
        if (quizDoc.exists()) {
          setQuiz(quizDoc.data());
        } else {
          setError('Quiz not found');
        }
      } catch (error) {
        setError('Error fetching quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleInputChange = (e, index, type, optionIndex = null) => {
    const updatedQuiz = { ...quiz };
    if (type === 'question') {
      updatedQuiz.questions[index].questionText = e.target.value;
    } else if (type === 'option') {
      updatedQuiz.questions[index].options[optionIndex] = e.target.value;
    } else if (type === 'answer') {
      updatedQuiz.questions[index].correctAnswer = e.target.value;
    }
    setQuiz(updatedQuiz);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'quizzes', id), quiz);
      navigate('/admin');
    } catch (error) {
      setError('Error updating quiz');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Quiz</h2>
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((question, index) => (
            <div key={index} className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Question {index + 1}
              </label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleInputChange(e, index, 'question')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Option {optionIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleInputChange(e, index, 'option', optionIndex)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <label className="block text-lg font-medium text-gray-700 mt-4">
                Answer
              </label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleInputChange(e, index, 'answer')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
