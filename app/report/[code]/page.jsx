"use client";
import Chart from './../../Components/Chart';
import PieCharts from './../../Components/PieCharts';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const ReportPage = ({ params }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const currentStudent = students?.find((student) => student.code == params.code);
  const quizzes = currentStudent?.quizzes || [];

  // Calculate total score, trials, and average percentage
  const totalScore = quizzes.reduce((total, quiz) => total + quiz.score, 0);
  const trials = quizzes.length;

  // Function to calculate the percentage for a single trial
  const calculateTrialPercentage = (score, numberOfQuestions) => {
    const maxScore = numberOfQuestions * 10; // Maximum possible score for the quiz
    return Math.round((score / maxScore) * 100); // Calculate percentage
  };

  // Calculate average percentage across all trials
  const averagePercentage =
    quizzes.reduce((total, quiz) => {
      const percentage = calculateTrialPercentage(quiz.score, quiz.quiz.quizQuestions.length);
      return total + percentage;
    }, 0) / trials || 0;

  const myCode = currentStudent?.code;

  const reportRef = useRef(null);

  const handlePrint = () => {
    // Capture the current page content
    const originalContent = document.body.innerHTML;

    // Hide all content except the certificate element
    const reportElement = reportRef.current;
    document.body.innerHTML = reportElement.outerHTML;

    // Trigger browser's print dialog
    window.print();

    // Restore original content
    document.body.innerHTML = originalContent;
  };

  return (
    <div className='mx-auto relative my-16 bg-white max-w-[1400px] gap-10 px-6 pt-12 flex flex-col justify-center' ref={reportRef}>
      <div>
        <Image src="/hero-img.svg" alt="progression" width={100} height={100} className='absolute top-10 left-10' />
        <h1 className='text-3xl text-theme font-bold underline w-full text-center'>Progression Monitoring Report</h1>
        <Image src="/print.svg" alt="progression" width={35} height={30} className='absolute top-10 right-10 cursor-pointer exclude-from-print' onClick={handlePrint} />
      </div>

      <div className='text-xl h-[450px] w-full items-center justify-between flex text-theme font-bold'>
        <div className="h-4/5 px-4 w-3/5 flex flex-col items-center justify-around">
          <div className='w-full grid grid-cols-3'>
            <h2 className='col-span-1'>Student Name :</h2>
            <span className='col-span-2 text-themeYellow'>{currentStudent?.fullName}</span>
          </div>
          <div className='w-full grid grid-cols-3'>
            <h2 className='col-span-1'>Student Code :</h2>
            <span className='col-span-2 text-themeYellow'>{params.code}</span>
          </div>
          <div className='w-full grid grid-cols-3'>
            <h2 className='col-span-1'>Grade :</h2>
            <span className='col-span-2 text-themeYellow'>{currentStudent?.grade}</span>
          </div>
          <div className='w-full grid grid-cols-3'>
            <h2 className='col-span-1'>Test Attempts :</h2>
            <span className='col-span-2 text-themeYellow'>{trials}</span>
          </div>
          <div className='w-full grid grid-cols-3'>
            <h2 className='col-span-1'>Total Score :</h2>
            <span className='col-span-2 text-themeYellow'>{totalScore}</span>
          </div>
          <div className='w-full grid grid-cols-3'>
            <h2 className='col-span-1'>Average Percentage :</h2>
            <span className='col-span-2 text-themeYellow'>{Math.round(averagePercentage)} %</span>
          </div>
        </div>
        <div className='h-full w-2/5'>
          <PieCharts code={myCode} />
        </div>
      </div>

      <div className='h-[600px] w-full mt-10'>
        <div className='h-[550px]'>
          <Chart code={myCode} />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;