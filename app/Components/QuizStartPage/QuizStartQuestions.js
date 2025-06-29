// components/QuizStartQuestions.js
"use client";
import React, { useEffect, useState } from 'react';
import useGlobalContextProvider from './../../ContextApi';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import QuestionSection from './../../Components/QuestionSection';
import ScoreComponent from './../../Components/ScoreComponent';

function QuizStartQuestions({ onUpdateTime }) {
  const { quizToStartObject } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const { quizQuestions } = selectQuizToStart;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [userAnswers, setUserAnswers] = useState(Array(quizQuestions.length).fill(-1));
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [images, setImages] = useState([]);

  const { data: session } = useSession();
  const code = session?.user?.code;
  const router = useRouter();

  useEffect(() => {
    fetchQuizAssets();
  }, [selectQuizToStart._id]);

  const fetchQuizAssets = async () => {
    try {
      const res = await fetch(`/api/quizzes?id=${selectQuizToStart._id}`);
      const data = await res.json();
      const currentQuiz = data.quizzes.find(quiz => quiz._id === selectQuizToStart._id);
      setImages(currentQuiz.quizAssets);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerSelection = (choiceIndex) => {
    setSelectedChoice(choiceIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = choiceIndex;
    setUserAnswers(newAnswers);
  };

  const moveToNextQuestion = () => {
    if (selectedChoice === null) {
      toast.error('Please select an answer');
      return;
    }
    const isCorrect = selectedChoice === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast.success('Correct Answer!');
    } else {
      toast.error('Incorrect Answer!');
    }
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
    } else {
      setIsQuizEnded(true);
      saveQuizResults();
    }
  };

  const saveQuizResults = async () => {
    const correctAnswers = quizQuestions.map(q => q.correctAnswer);
    const correctCount = userAnswers.filter((a, i) => a === correctAnswers[i]).length;
    const totalScore = correctCount * 10;
    try {
      const res = await fetch('/api/user/quizSubmisiion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          quiz: {
            _id: selectQuizToStart.id,
            score: totalScore,
            userAnswers,
          },
          totalScore,
        }),
      });
      if (res.ok) {
        toast.success('Quiz results saved successfully!');
      } else {
        const data = await res.json();
        console.error('Failed to save quiz results:', data.message);
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(quizQuestions.length).fill(-1));
    setScore(0);
    setIsQuizEnded(false);
    setSelectedChoice(null);
  };

  const handleCloseScoreComponent = () => {
    setIsQuizEnded(false);
  };

  return (
    <div className="poppins mx-auto my-8 max-w-7xl min-w-[900px] bg-white shadow-lg rounded-lg overflow-hidden">
      <Toaster />
      <div className="bg-gradient-to-r from-theme to-themeYellow p-4">
        <h2 className="text-2xl text-white font-semibold text-center">
          Quiz: {selectQuizToStart.quizTitle}
        </h2>
      </div>
      <div className="p-6">
        <QuestionSection
          question={quizQuestions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={quizQuestions.length}
          selectedChoice={selectedChoice}
          onSelectChoice={handleAnswerSelection}
          imageSrc={images[currentQuestionIndex]?.imgeSrc}
        />
        <div className="flex justify-end mt-6">
          <button
            onClick={moveToNextQuestion}
            disabled={isQuizEnded}
            className={`px-6 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow hover:text-black transition-all ${
              isQuizEnded ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
      {isQuizEnded && (
        <ScoreComponent
          quizQuestions={quizQuestions}
          userAnswers={userAnswers}
          score={score}
          quiz={selectQuizToStart}
          restartQuiz={restartQuiz}
          onClose={handleCloseScoreComponent}
        />
      )}
    </div>
  );
}

export default QuizStartQuestions;
