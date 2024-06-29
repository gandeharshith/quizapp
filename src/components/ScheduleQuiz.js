// src/components/ScheduleQuiz.js
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ScheduleQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, 'quizzes'), {
        title,
        questions,
        createdBy: 'adminUID',
        createdAt: Timestamp.now(),
      });
      alert('Quiz scheduled successfully');
      setTitle('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Schedule a Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Quiz Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Question {qIndex + 1}:</label>
                <input
                  type="text"
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center">
                    <label className="block text-gray-700 font-semibold mr-2">Option {oIndex + 1}:</label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Correct Answer:</label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button 
              type="button" 
              onClick={addQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Question
            </button>
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Schedule Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleQuiz;
