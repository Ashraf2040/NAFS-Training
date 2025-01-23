'use client';

import React, { useEffect, useState } from 'react';
import useGlobalContextProvider from './../../ContextApi'
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import the router
import { IoClose } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
// import { setUserScore, addQuizResult } from '@/app/reducers/userSlice';
// import { revalidatePath } from 'next/cache';

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

  const dispatch = useDispatch();
  const { data: session } = useSession();
  const code = session?.user?.code;

  useEffect(() => {
    fetchQuizAssets();
  }, [selectQuizToStart._id]);
  const handleCloseScoreComponent = () => {
    setIsQuizEnded(false); // Hide the ScoreComponent
  };
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
            _id: selectQuizToStart.id, // Quiz ID
            score: totalScore, // User's score for this quiz
            userAnswers, // User's answers
          },
          totalScore: totalScore, // Pass the total score to update the user's overall score
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        toast.success('Quiz results saved:', data.message);
      } else {
        console.error('Failed to save quiz results:', data.message);
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0); // Reset to the first question
    setUserAnswers(Array(quizQuestions.length).fill(-1)); // Reset user answers
    setScore(0); // Reset score
    setIsQuizEnded(false); // Hide the ScoreComponent
    setSelectedChoice(null); // Reset selected choice
  };

  return (
    <div className="relative poppins rounded-sm my-9 md:w-9/12 w-[95%]">
      <Toaster />
      <div className="flex items-center gap-2">
        <div className="bg-theme flex justify-center items-center rounded-md w-11 h-11 text-white p-3">
          {currentQuestionIndex + 1}
        </div>
        <div className="w-full grid lg:grid-cols-3 items-center gap-4">
          <p className={`${images[currentQuestionIndex]?.imgeSrc ? 'md:col-span-2' : 'col-span-3'}`}>
            {quizQuestions[currentQuestionIndex].mainQuestion}
          </p>
          {images[currentQuestionIndex]?.imgeSrc && (
            <Image src={images[currentQuestionIndex].imgeSrc} alt="image" className="col-span-1 rounded-md" width={300} height={300} />
          )}
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-2">
        {quizQuestions[currentQuestionIndex].choices.map((choice, index) => (
          <div
            key={index}
            onClick={() => handleAnswerSelection(index)}
            className={`p-3 ml-11 w-10/12 border border-theme rounded-md hover:bg-theme hover:text-white transition-all select-none ${
              selectedChoice === index ? 'bg-theme text-white' : 'bg-white'
            }`}
          >
            {choice}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-7">
        <button
          onClick={moveToNextQuestion}
          disabled={isQuizEnded}
          className={`p-2 px-5 text-[15px] text-white rounded-md bg-theme mr-[70px] ${
            isQuizEnded ? 'opacity-60' : 'opacity-100'
          }`}
        >
          Submit
        </button>
      </div>
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
             // Pass the restartQuiz function to ScoreComponent
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

  if (percentage < 60) {
    return emojiFaces[0]; // Confused emoji for less than 60%
  } else if (percentage >= 60 && percentage < 80) {
    return emojiFaces[1]; // Happy emoji for 60% to 80%
  } else {
    return emojiFaces[2]; // Very happy emoji for 80% and above
  }
}
function ScoreComponent({ quizStartParentProps }) {
  const { quizQuestions, userAnswers, score, quiz, session, restartQuiz } = quizStartParentProps;
  const correctAnswers = quizQuestions.map(question => question.correctAnswer);
  const correctCount = userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;
  const router = useRouter(); // Initialize the router

  // Function to handle closing the ScoreComponent and navigating to the home page
  const handleClose = () => {
    router.push('/'); // Navigate to the home page
  };
  return (
    <div className="flex items-center px-4 rounded-md top-[-80px] border flex-col border-gray-200 absolute w-full h-[480px] bg-white">
       <div className="absolute top-4 right-4 cursor-pointer" onClick={handleClose}>
        <IoClose className="text-2xl text-gray-600 hover:text-theme" />
      </div>
      <div className="flex gap-4 items-center w-full px-8 bg-purple-50 py-2">
        <Image src={`/${emojiIconScore(score, quizQuestions.length)}`} alt="" width={60} height={60} />
        <div className="flex gap-6 items-center mx-auto">
          <span className="font-bold text-2xl">Your Score :</span>
          <div className="text-[22px] text-center px-4 py-2 rounded-lg font-semibold text-theme">
            {score}/{quizQuestions.length * 10}
          </div>
        </div>
      </div>
      <div className="w-3/5 justify-between flex gap-2 my-6">
        <div className="flex gap-1 items-center justify-center">
          <Image src="/correct-answer.png" alt="" width={20} height={20} />
          <span className="text-[14px]">Correct Answers: {correctCount}</span>
        </div>
        <div className="flex gap-1 items-center justify-center">
          <Image src="/incorrect-answer.png" alt="" width={20} height={20} />
          <span className="text-[14px]">Incorrect Answers: {quizQuestions.length - correctCount}</span>
        </div>
        <button
          onClick={restartQuiz} // Call restartQuiz when the button is clicked
          className="p-2 bg-theme rounded-md text-white px-6"
        >
          Try Again
        </button>
      </div>
      <div className="w-full h-full px-16 overflow-y-scroll">
        <h1 className="font-extrabold text-xl text-theme my-6 m-auto w-full text-center mb-10 rounded-md sel">
          Quiz Title : {quiz?.quizTitle}
        </h1>
        {quizQuestions.map((question, index) => (
          <div key={index}>
            <h1 className="font-semibold text-lg text-theme my-4 ">
              Question {index + 1} : <span className='text-[#ff7e67]'>{question?.mainQuestion}</span> 
            </h1>
            <div className="w-full px-4 flex items-center justify-between bg-purple-50 p-4 rounded-md">
              <div className="flex flex-col gap-2">
                <h1 className="min-w-3/5 flex items-center gap-4 font-normal">
                  Your Answer :
                  <span className={`text-${userAnswers[index] === question.correctAnswer ? 'green-600' : 'red-500'}`}>
                    {question.choices[userAnswers[index]]}
                  </span>
                </h1>
                <h1>The Correct Answer : {question.choices[question.correctAnswer]}</h1>
              </div>
              <p>Points : {userAnswers[index] === question.correctAnswer ? 10 : 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizStartQuestions;