"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ShowStatistics = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

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
        setFilteredStudents(data); // Initialize filtered students
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students when nameFilter or gradeFilter changes
  useEffect(() => {
    const filtered = students.filter((student) => {
      const matchesName = student.fullName
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesGrade = gradeFilter
        ? student.grade === gradeFilter
        : true;
      return matchesName && matchesGrade;
    });
    setFilteredStudents(filtered);
  }, [nameFilter, gradeFilter, students]);

  const calculateTrialPercentage = (score, numberOfQuestions) => {
    const maxScore = numberOfQuestions * 10;
    return Math.round((score / maxScore) * 100);
  };

  const calculateAveragePercentage = (quizzes) => {
    if (!quizzes || quizzes.length === 0) return 0;

    const totalPercentage = quizzes.reduce((sum, quiz) => {
      const percentage = calculateTrialPercentage(quiz.score, quiz.quiz.quizQuestions.length);
      return sum + percentage;
    }, 0);

    return Math.round(totalPercentage / quizzes.length);
  };

  return (
    <div className="statistcs w-full mt-4 bg-theme h-full rounded-[4px]">
      {/* Filter Header */}
      <div className="filter-header p-4 bg-gradient-to-r from-theme to-themeYellow rounded-t-[4px]">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="nameFilter" className="block text-white mb-1">
              Filter by Name
            </label>
            <input
              type="text"
              id="nameFilter"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Enter student name..."
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-theme"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="gradeFilter" className="block text-white mb-1">
              Filter by Grade
            </label>
            <select
              id="gradeFilter"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-theme"
            >
              <option value="">All Grades</option>
              {/* Add your grade options here based on your data */}
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
             
              {/* Modify these options based on your actual grade system */}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full flex flex-col px-1">
        <thead>
          <tr className="text-white grid grid-cols-9 py-1">
            <td className="mx-auto">Code</td>
            <td className="col-span-1">Grade</td>
            <td className="col-span-2 w-full text-center">Name</td>
            <td className="mx-auto">Trials</td>
            <td className="text-center mx-auto">Score</td>
            <td className="text-center mx-auto">Percentage</td>
            <td className="text-center mx-auto">Progress</td>
            <td className="text-center mx-auto">Report</td>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => {
            const averagePercentage = calculateAveragePercentage(student.quizzes);

            return (
              <tr
                key={index}
                className="bg-white w-full grid grid-cols-9 py-1 font-normal mb-2"
              >
                <td className="text-center font-semibold text-red-500">
                  {student?.code}
                </td>
                <td className="text-center font-semibold text-theme">
                  {student?.grade}
                </td>
                <td className="col-span-2 text-center text-theme font-semibold w-full">
                  {student?.fullName}
                </td>
                <td className="text-center text-theme font-semibold">
                  {student?.quizzes?.length}
                </td>
                <td className="text-center text-theme font-semibold">
                  {student?.quizzes
                    ?.map((quiz) => quiz.score)
                    .reduce((a, b) => a + b, 0)}
                </td>
                <td className="text-center text-theme font-semibold">
                  {averagePercentage}%
                </td>
                <td
                  className={`text-center ${
                    averagePercentage >= 65 ? "text-green-500" : "text-red-500"
                  } font-semibold`}
                >
                  {averagePercentage >= 65 ? "Passed" : "Failed"}
                </td>
                <td className="text-center underline text-themeYellow font-semibold">
                  <Link href={`/report/${student.code}`}>Report</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ShowStatistics;