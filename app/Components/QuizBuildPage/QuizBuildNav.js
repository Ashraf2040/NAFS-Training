"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useGlobalContextProvider from './../../ContextApi';
import { v4 as uuidv4 } from 'uuid';
import { faCode } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import convertFromFaToText from './../../convertFromFaToText';
import { icon } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { restQuizAssets, setQuizAssets } from './../../reducers/questionSlice';

function validateQuizQuestions(quizQuestions) {
  for (let question of quizQuestions) {
    // Check if the main question is empty
    if (!question.mainQuestion.trim()) {
      return { valid: false, message: 'Please fill in the main question.' };
    }

    // Check if any choice is empty
    if (question.choices.some((choice) => !choice.trim().substring(2))) {
      return { valid: false, message: 'Please fill in all choices.' };
    }

    // Check if the correct answer is empty
    if (question.correctAnswer.length === 0) {
      return { valid: false, message: 'Please specify the correct answer.' };
    }
  }
  return { valid: true };
}

function QuizBuildNav({ newQuiz, setNewQuiz }) {
  const { allQuizzes, setAllQuizzes, selectedQuizObject } =
    useGlobalContextProvider();

  const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [questionImage, setQuestionImage] = useState("");
  const questionImageUrl = useSelector((state) => state.question.questionImageUrl);

  const quizAssets = useSelector((state) => state.question.quizAssets);

  async function createNewQuiz() {
    try {
      setIsLoading(true);
      const textIcon = convertFromFaToText(newQuiz.icon);
      if (questionImageUrl) {
        console.log("questionImageUrl, ", questionImageUrl);
        setQuestionImage(questionImageUrl);
      }
      const quizWithTextIcon = {
        ...newQuiz,
        icon: textIcon,
        _id: uuidv4(),
        quizAssets,
      };

      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(quizWithTextIcon), // Adding the new quiz to the db
      });

      if (!res.ok) {
        toast.error('Failed to create a new quiz!');
        setIsLoading(false);
        return;
      }

      const { id } = await res.json();
      console.log(id);
      // Update the _id property of the newQuiz object
      const updatedQuiz = { ...newQuiz, _id: id, icon: textIcon };

      setAllQuizzes([...allQuizzes, updatedQuiz]);
      toast.success('The quiz has been created successfully!');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveQuiz() {
    if (newQuiz.quizTitle.trim(' ').length === 0) {
      return toast.error('Please add a name for the quiz!');
    }

    const isValid = validateQuizQuestions(newQuiz.quizQuestions);
    if (isValid.valid === false) {
      toast.error(isValid.message);
      return;
    }

    if (selectedQuiz) {
      const updatedQuiz = [...allQuizzes]; // Assuming allQuizzes contains the current state of quizzes
      const findIndexQuiz = updatedQuiz.findIndex(
        (quiz) => quiz._id === newQuiz._id,
      );

      if (findIndexQuiz !== -1) {
        updatedQuiz[findIndexQuiz] = newQuiz;
      }
      const id = updatedQuiz[findIndexQuiz]._id;
      console.log("your id is ", id);
      const convertIconText = convertFromFaToText(
        updatedQuiz[findIndexQuiz].icon,
      );
      console.log(updatedQuiz[findIndexQuiz]);
      updatedQuiz[findIndexQuiz].icon = convertIconText;
      try {
        const res = await fetch(`http://localhost:3000/api/quizzes?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            updateQuiz: updatedQuiz[findIndexQuiz],
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to update quiz');
        }

        toast.success('The quiz has been saved successfully.');
        setAllQuizzes(updatedQuiz);
      } catch (error) {}
    } else {
      createNewQuiz();

      router.push('/'); // Navigate to main page
      // dispatch(restQuizAssets())
    }
  }
  const dispatch = useDispatch();
  const handleClikSave = () => {
    saveQuiz();
    dispatch(restQuizAssets());
  };

  return (
    <div className="poppins my-12 flex justify-between items-center ">
      <div className="flex gap-2 items-center">
        <Image src="/hero-img.svg" alt="" height={100} width={100} />
        <span className="text-2xl">
          Quiz <span className="text-theme font-bold">Builder</span>
        </span>
        <Link href="/upload-file" className='text-2xl md:ml-8 underline cursor-pointer '>From  <span className='text-theme font-semibold'>a document</span></Link>
      </div>
      <button
        onClick={handleClikSave}
        className="p-2 px-4 bg-theme rounded-md text-white"
      >
        {isLoading ? 'Loading...' : 'Save'}
      </button>
    </div>
  );
}

export default QuizBuildNav;