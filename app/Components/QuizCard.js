'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import {
  faCode,
  faEllipsis,
  faPlay,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import useGlobalContextProvider from '../ContextApi';
import { icon } from '@fortawesome/fontawesome-svg-core';
import convertToFaIcons from '../convertToFaIcons';


// function successRate(singleQuiz) {
//   let correctQuestions = 0;
//   let totalAttemptes = 0;
//   let successRate = 0;

//   singleQuiz.quizQuestions.forEach((question) => {
//     totalAttemptes += question.statistics.totalAttempts;
//     correctQuestions += question.statistics.correctAttempts;
//   });

//   successRate = Math.ceil((correctQuestions / totalAttemptes) * 100);
//   return successRate;
// }

function QuizCard({ singleQuiz ,hoveredOutcome,assignQuizToGrade,role,assignedQuizzes,userQuizzes}) {
  console.log(singleQuiz)
  const {
    quizToStartObject,
    dropDownToggleObject,
    threeDotsPositionsObject,
    selectedQuizObject,
  } = useGlobalContextProvider();
  const { setDropDownToggle } = dropDownToggleObject;
  //
  const { setSelectQuizToStart } = quizToStartObject;
  const { setThreeDotsPositions } = threeDotsPositionsObject;
  const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;
  const [isExpanded, setIsExpanded] = useState(false);
  const { quizTitle, quizQuestions, icon } = singleQuiz;

  const totalQuestions = quizQuestions.length;
  // const globalSuccessRate = successRate(singleQuiz);
  //
  
  function openDropDownMenu(event) {
    const xPos = event.clientX;
    const yPos = event.clientY;

    setThreeDotsPositions({ x: xPos, y: yPos });

    if (event) {
      event.stopPropagation();
    }

    setDropDownToggle(true);
    setSelectedQuiz(singleQuiz);
  }
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return text;
  };
console.log(userQuizzes)

  console.log(assignedQuizzes)

  const isCompleted = userQuizzes?.some((quiz) => quiz.quizId === singleQuiz.id);
  // const isCompleted = assignedQuizzes.some((quiz) => quiz.id === singleQuiz.id);
  return (
    <div className="rounded-[10px] flex flex-col items-center gap-2 border border-gray-300 p-4 bg-white w-72 h-64 shadow transition-all">
      {/* Image Container */}
      <div className={`relative ${hoveredOutcome?"bg-transparent":"bg-theme"}  w-full h-32 flex justify-center items-center  rounded-md `}>
        {/* More Options Icon */}
        <div className="absolute cursor-pointer top-3 right-3">
          <FontAwesomeIcon
            className="text-white"
            height={13}
            width={13}
            icon={faEllipsis}
            onClick={openDropDownMenu}
          />
        </div>
        {/* Quiz Icon */}
        <FontAwesomeIcon
          className="text-white text-3xl"
          width={120}
          height={120}
          icon={convertToFaIcons(icon)}
        />
      </div>
      {/* Title Area */}
      <h3 className="font-bold ">
        
        {/* {quizTitle} */}
        <p
      className="cursor-pointer  hover:underline"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? quizTitle : truncateText(quizTitle, 5)}
    </p>
        
        </h3>
      {/* Questions */}
      <p className="text-sm font-light">{totalQuestions} question(s)</p>
      {/* Footer Area */}
      <div className="flex gap-3 w-full">
        {/* success rate area */}
      
        <div className='flex items-center justify-between w-full'>
        <div
          onClick={() => {
            setSelectQuizToStart(singleQuiz);
          }}
          className="rounded-full w-7 h-7 bg-themeYellow flex items-center justify-center cursor-pointer "
        >
          <Link href="/quiz-start">
            <FontAwesomeIcon
              className="text-white"
              width={15}
              height={15}
              icon={faPlay}
            />
          </Link>
         
        </div>
       
       
       {role==="AD" && <button
        className={` self-center ${singleQuiz.assignments.length>0?"text-theme":"text-themeRed"}    rounded-md mt-2 font-semibold`}
        onClick={() => assignQuizToGrade(singleQuiz.id)}
      >
      {singleQuiz.assignments.length>0?"Assigned":"Assign"}
      
      </button>}
      
       </div>
<div>{role==="ST"&& <p className={`font-semibold w-fit ${isCompleted?"text-green-600":"text-themeRed"}`}>{isCompleted ? "Completed" : "Incomplete"}</p>}</div>
        </div>
        
      </div>
    
  );
}

export default QuizCard;