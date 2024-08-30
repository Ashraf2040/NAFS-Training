"use client"


import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const QuizPreview = () => {
    const [answer,setAnswer]=useState([])
    const [quiz,setQuiz]=useState([])
    const [title,setTitle]=useState('')
    useEffect(() => {
        const userAnswer = localStorage.getItem('answers')
        const quiz = localStorage.getItem('quiz')
        
        setAnswer(JSON.parse(userAnswer))
        setQuiz(JSON.parse(quiz).quizQuestions)
        setTitle(JSON.parse(quiz).quizTitle)
    }, [])
console.log(answer)
console.log(quiz)


    
 

  return (

    <div className='w-4/5 h-full    py-10 px-16  '>
   <h1 className='font-extrabold text-xl  text-theme my-6  m-auto w-full text-center mb-10 rounded-md sel'>Quiz Title :  {title}</h1>
   {quiz.length >0 && (
 quiz.map((question, index) => ( <>
    <h1 className='font-semibold text-lg text-theme my-4  underline' key={index}> Question {index + 1} : {question.mainQuestion} </h1>
    <div className="w-full px-4 flex  items-center justify-between bg-purple-50 p-4 rounded-md  ">
    <div className='flex flex-col gap-2 '>
    <h1 className='min-w-3/5 flex items-center gap-4 font-normal '> Your Answer : 
   <span className={`text-${
                question.choices[answer[index]] === question.choices[question.correctAnswer] ? 'green-600' : 'red-500'
              }`}>
                {question.choices[answer[index]]}
              </span></h1>
   <h1> The Correct Answer : {question.choices[question.correctAnswer]} </h1>
    </div>
   
    
   
   <p>Points : {question.choices[answer[index]] === question.choices[question.correctAnswer] ? 10 : 0}</p>
    
    </div>
    
    </>
))
   )}
  
  
    </div>
    // <div className="flex items-center justify-center rounded-md border border-gray-200 absolute w-full min-h-[480px] overflow-y-scroll flex-col font-semibold bg-white gap-6 p-10 ">
    //     <h1 className="bg-theme text-themeYellow py-2 px-6 rounded-md">Review Questions</h1>
    //     <div className="w-full px-4 flex flex-col gap-4">
    //       {quizQuestions.map((question, index) => (
    //         <div key={index} className="my-2">
    //           <h1 className="">
    //             <span className="font-extrabold  text-theme  rounded-md ">Question {index + 1} :</span>
    //             <span className="ml-2">{question.mainQuestion}</span>
    //           </h1>
    //           <h1 className=" min-w-3/5 flex items-center gap-4 font-normal text-sm">Your Answer is :
    //           <span className={`text-${
    //             getUserAnswer(index) === question.choices[question.correctAnswer] ? 'green-600' : 'red-500'
    //           }`}>
    //             {getUserAnswer(index)}
    //           </span>
    //           </h1>
              
    //           <h1 className="text-green-600 min-w-3/5  flex items-center gap-4 font-normal text-sm">Correct Answer: <span className=''>{question.choices[question.correctAnswer]}</span>  <span className='absolute right-4'>Points : {`${getUserAnswer(index) === question.choices[question.correctAnswer] ? 10 : 0}`}</span></h1>
    //         </div>
    //       ))}
    //     </div>

    //     <button onClick={()=>setIsResultPreview(false)} className='w-6 h-6 bg-theme text-white rounded-full absolute top-2 right-4'>X</button>
    //   </div>
  )
}

export default QuizPreview
