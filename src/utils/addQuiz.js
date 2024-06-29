// src/utils/addQuiz.js
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const addQuiz = async () => {
  try {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      title: 'Sample Quiz',
      createdBy: 'adminUID',
      createdAt: Timestamp.now(),
      questions: [
        {
          questionText: 'What is 2 + 2?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '4'
        },
        {
          questionText: 'What is the capital of France?',
          options: ['Berlin', 'London', 'Paris', 'Madrid'],
          correctAnswer: 'Paris'
        }
      ]
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export default addQuiz;
