"use client"


import React, { useState, useEffect } from 'react';
'../Components/QuizBuildPage/QuizBuildTitle';

import { v4 as uuidv4 } from 'uuid';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';


import { useSelector } from 'react-redux';




import useGlobalContextProvider from '../../ContextApi';
import IconsComponents from '../../Components/QuizBuildPage/IconsComponents';
import QuizBuildNav from '../../Components/QuizBuildPage/QuizBuildNav';
import QuizBuildTitle from '../../Components/QuizBuildPage/QuizBuildTitle';
import QuizBuildQuestions from '../../Components/QuizBuildPage/QuizBuildQuestions';

function Page(props) {
  const prefixes = ['A', 'B', 'C', 'D'];
  const { selectedIconObject, selectedQuizObject } = useGlobalContextProvider();
  const { selectedIcon } = selectedIconObject;
  const { selectedQuiz } = selectedQuizObject;
  const [focusFirst, setFocusFirst] = useState(true);
  const currentQuestionImageUrl = useSelector((state) => state.question.questionImageUrl);

  const [quizQuestions, setQuizQuestions] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz.quizQuestions;
    } else {
      return [
        {
          id: uuidv4(),
          mainQuestion: '',
          questionImageUrl: currentQuestionImageUrl,
          choices: prefixes.slice(0, 2).map((prefix) => prefix + '. '),
          correctAnswer: '',
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
          // quizImageUrl: '',
        },
      ];
    }
  });

  const [newQuiz, setNewQuiz] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz;
    } else {
      return {
        _id: '',
        icon: selectedIcon.faIcon,
        quizTitle: '',
        quizQuestions: quizQuestions,
         // Initialize subject
        // grade: '',
        subject: 'Math', // Set default subject
        grade: '3',
        skill: 'skill 1',
        
         // Initialize grade
        // quizImageUrl:""
      };
    }
  });

  // console.log(newQuiz);

  useEffect(() => {
    setNewQuiz((prevQuiz) => ({
      ...prevQuiz,
      icon: selectedIcon.faIcon,
      quizQuestions: quizQuestions,
      // quizImageUrl:""
    }));
  }, [quizQuestions, selectedIcon.faIcon]);
  // function handleSubjectChange(subject) {
  //   setNewQuiz((prevQuiz) => ({ ...prevQuiz, subject }));
  // }
  function handleSubjectChange(subject) {
  setNewQuiz((prevQuiz) => ({ ...prevQuiz, subject }));
}

  function handleGradeChange(grade) {
    setNewQuiz((prevQuiz) => ({ ...prevQuiz, grade }));
  }
  function handleSkillChange(skill) {
    setNewQuiz((prevQuiz) => ({ ...prevQuiz, skill }));
  }

  function onChangeQuizTitle(text) {
    setNewQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle: text }));
  }

  const quizNavBarProps = {
    quizQuestions,
    newQuiz,
    setNewQuiz,
  };

 
  const quizTitleProps = {
    focusProp: { focus: focusFirst, setFocusFirst },
    onChangeQuizTitle,
    onSubjectChange: handleSubjectChange,
    onGradeChange: handleGradeChange,
    onSkillChange: handleSkillChange,
    newQuiz, // Pass newQuiz for read-only access
  };

  const quizQuestionsProps = {
    focusProp: { focus: !focusFirst, setFocusFirst },
    quizQuestions,
    setQuizQuestions,
  };

  return (
    <div className=" relative mx-16 poppins">
      <IconsComponents />
      <QuizBuildNav {...quizNavBarProps} />
      <QuizBuildTitle {...quizTitleProps} />
      <QuizBuildQuestions {...quizQuestionsProps} />
    </div>
  );
}

export default Page;