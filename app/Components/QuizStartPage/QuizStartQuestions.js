"use client";
import React, { useEffect, useState } from 'react';
import useGlobalContextProvider from './../../ContextApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

function QuizStartQuestions({ onUpdateTime }) {
  const { quizToStartObject, allQuizzes, setAllQuizzes } = useGlobalContextProvider();
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
    const correctAnswers = quizQuestions.map(question => question.correctAnswer);
    const correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;
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
          totalScore: totalScore,
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
    <div className="poppins mx-auto my-8 max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <Toaster />
      {/* Header */}
      <div className="bg-gradient-to-r from-theme to-themeYellow p-4">
        <h2 className="text-2xl text-white font-semibold text-center">
          Quiz: {selectQuizToStart.quizTitle}
        </h2>
      </div>

      {/* Question Section */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-theme text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
            {currentQuestionIndex + 1}
          </div>
          <div className="flex-1">
            <p className="text-lg text-gray-800 font-medium">
              {quizQuestions[currentQuestionIndex].mainQuestion}
            </p>
            {images[currentQuestionIndex]?.imgeSrc && (
              <Image
                src={images[currentQuestionIndex].imgeSrc}
                alt="Question Image"
                width={200}
                height={200}
                className="mt-4 rounded-md shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Choices */}
        <div className="mt-6 space-y-3">
          {quizQuestions[currentQuestionIndex].choices.map((choice, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelection(index)}
              className={`p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:bg-theme hover:text-white ${
                selectedChoice === index ? 'bg-theme text-white' : 'bg-white text-gray-800'
              }`}
            >
              {choice}
            </div>
          ))}
        </div>

        {/* Submit Button */}
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

      {/* Score Component */}
      {isQuizEnded && (
        <ScoreComponent
          quizStartParentProps={{
            quizQuestions,
            userAnswers,
            score,
            quiz: selectQuizToStart,
            session,
            restartQuiz,
            onClose: handleCloseScoreComponent,
          }}
        />
      )}
    </div>
  );
}

function emojiIconScore(score, totalQuestions) {
  const emojiFaces = [
    'confused-emoji.png', // Less than 60%
    'happy-emoji.png',    // 60% to 80%
    'very-happy-emoji.png' // 80% and above
  ];

  const percentage = (score / (totalQuestions * 10)) * 100;

  if (percentage < 60) return emojiFaces[0];
  else if (percentage >= 60 && percentage < 80) return emojiFaces[1];
  else return emojiFaces[2];
}

function ScoreComponent({ quizStartParentProps }) {
  const { quizQuestions, userAnswers, score, quiz, session, restartQuiz, onClose } = quizStartParentProps;
  const correctAnswers = quizQuestions.map(question => question.correctAnswer);
  const correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white max-w-2xl w-full mx-4 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-theme to-themeYellow p-4 flex justify-between items-center">
          <h3 className="text-xl text-white font-semibold">Quiz Results</h3>
          <IoClose
            className="text-2xl text-white cursor-pointer hover:text-gray-200"
            onClick={handleClose}
          />
        </div>

        {/* Score Summary */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center gap-4">
            <Image
              src={`/${emojiIconScore(score, quizQuestions.length)}`}
              alt="Score Emoji"
              width={60}
              height={60}
            />
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-theme">Your Score:</span>
              <div className="text-3xl text-themeYellow font-semibold mt-2">
                {score}/{quizQuestions.length * 10}
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Image src="/correct-answer.png" alt="" width={20} height={20} />
              <span>Correct: {correctCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/incorrect-answer.png" alt="" width={20} height={20} />
              <span>Incorrect: {quizQuestions.length - correctCount}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={restartQuiz}
              className="px-6 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow hover:text-black transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h4 className="text-xl text-theme font-semibold text-center mb-4">
            {quiz?.quizTitle}
          </h4>
          {quizQuestions.map((question, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h5 className="text-lg text-theme font-medium">
                Q{index + 1}: <span className="text-gray-700">{question.mainQuestion}</span>
              </h5>
              <div className="mt-2 p-4 bg-gray-100 rounded-md flex justify-between items-center">
                <div className="space-y-1">
                  <p>
                    Your Answer:{' '}
                    <span className={userAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-500'}>
                      {question.choices[userAnswers[index]]}
                    </span>
                  </p>
                  <p>Correct Answer: <span className="text-gray-800">{question.choices[question.correctAnswer]}</span></p>
                </div>
                <p className="text-theme font-semibold">
                  {userAnswers[index] === question.correctAnswer ? '+10' : '0'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizStartQuestions;