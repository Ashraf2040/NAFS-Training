'use client';
import React, { useEffect, useState } from 'react';
import QuizCard from './QuizCard';
import PlaceHolder from './PlaceHolder';
import useGlobalContextProvider from '../ContextApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DropDown from './DropDown';
import { useSession } from 'next-auth/react';
import { connectToDB } from '@/libs/mongoDB';
import Link from 'next/link';
import Hero from './Hero';
import { CloudCog } from 'lucide-react';

function QuizzesArea({ props }) {
  const { allQuizzes, userObject, isLoadingObject } =
    useGlobalContextProvider();
  const router = useRouter();
  const { user, setUser } = userObject;
  const [students, setStudents] = useState([])
  const [statShow, setStatShow] = useState(false)
  const [subject, setSubject] = useState('Math')
  const [grade, setGrade] = useState('3')
  const [skill, setSkill] = useState('skill 1')
  const { isLoading } = isLoadingObject;
  // console.log(isLoading);
  const {data:session}=useSession()
  const skills=["Skill 1","Skill 2","Skill 3","Skill 4","Skill 5","Skill 2"]

  useEffect(() => {
    const getStudentData = async () => {
      await fetch('/api/user/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          
        //  console.log(data)
          setStudents(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
 
              getStudentData();
  }, [setStudents]);

  const filterQuizzes = (quizzes, subject, grade,skill) => {
    return quizzes.filter(quiz => {
      return quiz.subject === subject && quiz.grade === grade && quiz.skill === skill;
    });
  };
 const quizzes=     filterQuizzes(allQuizzes, subject, grade,skill);



  return (
    <div className="poppins mx-12 mt-10 h-full  ">
      
      <div>
        {isLoading ? (
          <div></div>
        ) : user.isLogged ? (
          <>
          <Hero />
            {allQuizzes.length === 0 ? (
              <PlaceHolder />
            ) : (
              <div className=''>
                <DropDown />
                <div className=' px-4 my-6 py-3 mx-auto rounded-md bg-theme font-bold text-white flex items-center justify-between '>
                  <h1 className='flex items-center gap-2'>Choose Your Quiz  <span><Image src="/arrow1.svg" alt='' width={20} height={20} /></span></h1>
                 <div> <span className='mr-2'>Subject :</span>
                  <select name="subject" id="" className='text-theme px-2 rounded-md'onChange={(e)=>setSubject(e.target.value)} >
                    <option value="Math" >Math</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    
                  </select></div>
                 <div> <span
                 className='mr-2'>Grade :</span>
                  <select name="subject" id="" className='text-theme px-2 rounded-md' onChange={(e)=>setGrade(e.target.value)}>
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    
                  </select></div>
                 <div> <span
                 className='mr-2'>Skill :</span>
                  <select name="subject" id="" className='text-theme px-2 rounded-md' onChange={(e)=>setSkill(e.target.value)}>
                 { skills.map((skill)=> <option value={skill.toLocaleLowerCase()} key={skill.toLocaleLowerCase()}>{skill}</option>)}
                  
                    
                  </select></div>
                </div>
                <h2 className="text-xl font-bold flex gap-2 text-theme px-4 rounded-md py-2 max-w-fit items-center"> <span><Image src='/earth.svg' width={30} height={30} alt="" /></span>My Quizzes ...</h2>
                <div className="mt-6 flex gap-2 flex-wrap">
                  <div className="flex gap-2 flex-wrap items-center  ">
                    {quizzes.map((singleQuiz, quizIndex) => (
                      <div key={quizIndex} className='flex-grow md:flex-grow-0'>
                        <QuizCard singleQuiz={singleQuiz} />
                      </div>
                    ))}
                    {session && session.user.role === 'AD' &&
                    <div
                    onClick={() => router.push('/quiz-build')}
                    className=" cursor-pointer justify-center items-center rounded-[10px]
                   w-[230px] flex flex-col gap-2 border border-gray-100 bg-white p-4"
                  >
                    <Image
                      src={'/add-quiz.png'}
                      width={160}
                      height={160}
                      alt=""
                    />
                    <span className="select-none opacity-40">
                      Add a new Quiz
                    </span>
                  </div>}
                  </div>
                  
                  
                </div>
                <button className="text-xl font-bold flex gap-2  text-theme px-4 rounded-md mt-8 py-2 max-w-fit" onClick={() => setStatShow(!statShow)}> <span><Image src={'/statistics.svg'} width={20} height={20} alt="" /></span>Statistics ...</button>

             { statShow &&
               <div className="statistcs w-full mt-4 bg-theme h-full rounded-[4px]">
<table className='w-full  flex flex-col px-1  '>
  <th className='text-center '>
    <tr className='text-white grid grid-cols-10  py-1 '>
    <td className=' mx-auto'>Code</td>
    <td className='col-span-1 '>Grade</td>
    <td className='col-span-2   w-full text-center'>Name</td>
    <td className=' mx-auto'>No Of Trials</td>
    <td className='text-center mx-auto'>Previous Score</td>
    <td className='text-center mx-auto'>Current Score</td>
    <td className='text-center mx-auto'>Progress</td>
    <td className='text-center mx-auto'>Total Points</td>
    <td className='text-center mx-auto'>Report</td>
    
    </tr>
    
  </th>

 
    {students.map((student, index) => (
      <tr key={index} className='bg-white w-full grid grid-cols-10 py-1    font-normal mb-2'>
        <td className=' text-center font-semibold text-red-500'>{student.code}</td>
        <td className=' text-center font-semibold text-theme'>{student.grade}</td>
        <td className='col-span-2 text-center text-theme font-semibold  w-full '>{student.fullName}</td>
        <td className=' text-center'>{student.trials.length-1}</td>
        <td className=' text-center'>{student.trials[student.trials.length-2]}</td>
        <td className=' text-center'>{student.trials[student.trials.length-1]}</td>
        <td className={` text-center ${student.trials[student.trials.length-1]>=student.trials[student.trials.length-2] ?"text-themeGreen font-semibold" : "text-red-600 font-semibold"}`}>
{student.trials[student.trials.length-1]>=student.trials[student.trials.length-2] ?"Passed" : "Failed"}
        </td>
        <td className=' text-center'>{student.score}</td>
        <td className=' text-center underline text-themeYellow font-semibold '><Link href={`/report/${student.code}`}>Report</Link></td>
      </tr>
    ))}
   
  
</table>
                </div>}
              </div>
            )}
          </>
        ) : (
          <div className="  h-96 flex flex-col text-2xl gap-4 justify-center items-center">
            <h2 className="font-bold md:text-5xl  text-themeYellow">
            <span className="text-theme">NAFS</span>  Training Platform 
            </h2>
            <span className="text-xl font-semibold text-center ">
              Unlock Your Potential with Personalized Quizzes
            </span>
            <button
              onClick={() => {
                setUser((prevUser) => ({ ...prevUser, isLogged: true }));
              }}
              className="p-4 bg-theme text-white font-semibold rounded-md"
            >
              Get Started Now!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizzesArea;