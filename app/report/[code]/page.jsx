"use client";
import Chart from './../../Components/Chart';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const ReportPage = ({ params }) => {
  const [students, setStudents] = useState([]);
  const [quizStats, setQuizStats] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const reportRef = useRef(null);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch quiz statistics when subject changes
  useEffect(() => {
    if (!params.code || !selectedSubject) return;

    const fetchQuizStats = async () => {
      try {
        const response = await fetch(`/api/students/${params.code}/quiz-stats?subject=${selectedSubject}&code=${params.code}`);
        if (!response.ok) throw new Error("Failed to fetch quiz stats");
        const data = await response.json();
        setQuizStats(data);
      } catch (error) {
        console.error("Error fetching quiz stats:", error);
      }
    };
    fetchQuizStats();
  }, [params.code, selectedSubject]);

  const currentStudent = students?.find((student) => student.code == params.code);
  const quizzes = currentStudent?.quizzes || [];

  // Calculate totals
  const totalScore = quizzes.reduce((total, quiz) => total + quiz.score, 0);
  const trials = quizzes.length;
  const calculateTrialPercentage = (score, numberOfQuestions) => {
    const maxScore = numberOfQuestions * 10;
    return Math.round((score / maxScore) * 100);
  };
  const averagePercentage = quizzes.length > 0
    ? Math.round(quizzes.reduce((total, quiz) => 
        total + calculateTrialPercentage(quiz.score, quiz.quiz.quizQuestions.length), 0) / trials)
    : 0;

  const handlePrint = () => {
    const originalContent = document.body.innerHTML;
    const reportElement = reportRef.current;
    document.body.innerHTML = reportElement.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="mx-auto my-8 max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden" ref={reportRef}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-theme to-themeYellow p-6">
        <Image 
          src="/hero-img.svg" 
          alt="progression" 
          width={80} 
          height={80} 
          className="absolute top-4 left-4" 
        />
        <h1 className="text-4xl text-white font-bold text-center">Progression Monitoring Report</h1>
        <Image 
          src="/print.svg" 
          alt="print" 
          width={30} 
          height={30} 
          className="absolute top-6 right-6 cursor-pointer exclude-from-print hover:opacity-80" 
          onClick={handlePrint} 
        />
      </div>

      {/* Student Details */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl text-theme font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-40">Name:</span>
            <span className="text-themeYellow font-semibold">{currentStudent?.fullName || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-40">Code:</span>
            <span className="text-themeYellow font-semibold">{params.code}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-40">Grade:</span>
            <span className="text-themeYellow font-semibold">{currentStudent?.grade || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-40">Test Attempts:</span>
            <span className="text-themeYellow font-semibold">{trials}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-40">Total Score:</span>
            <span className="text-themeYellow font-semibold">{totalScore}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-40">Avg. Percentage:</span>
            <span className="text-themeYellow font-semibold">{averagePercentage}%</span>
          </div>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <label htmlFor="subjectFilter" className="text-theme font-semibold">Select Subject:</label>
          <select
            id="subjectFilter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
          >
            <option value="">Choose a subject</option>
            <option value="Science">Science</option>
            <option value="Math">Math</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Quiz Statistics Table */}
      {selectedSubject && (
        <div className="p-6">
          <h2 className="text-2xl text-theme font-semibold mb-4">{selectedSubject} Quiz Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
              <thead>
                <tr className="bg-theme text-white">
                  <th className="p-3 text-left rounded-tl-lg">Quiz Title</th>
                  <th className="p-3 text-center">Assigned</th>
                  <th className="p-3 text-center">Completed</th>
                  <th className="p-3 text-center rounded-tr-lg">Score</th>
                </tr>
              </thead>
              <tbody>
                {quizStats.length > 0 ? (
                  quizStats.map((stat, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{stat.quizTitle}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block w-20 py-1 rounded-full text-white ${stat.assigned ? 'bg-green-500' : 'bg-red-500'}`}>
                          {stat.assigned ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block w-20 py-1 rounded-full text-white ${stat.completed ? 'bg-green-500' : 'bg-red-500'}`}>
                          {stat.completed ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-800">
                        {stat.score !== null ? stat.score : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No quiz statistics available for this subject.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      <div className="p-6">
        <h2 className="text-2xl text-theme font-semibold mb-4">Progress Overview</h2>
        <div className="h-[500px]">
          <Chart code={params.code} />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;