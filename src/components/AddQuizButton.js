// src/components/AddQuizButton.js
import React from 'react';
import addQuiz from '../utils/addQuiz';

const AddQuizButton = () => {
  return (
    <button onClick={addQuiz}>
      Add Sample Quiz
    </button>
  );
};

export default AddQuizButton;
