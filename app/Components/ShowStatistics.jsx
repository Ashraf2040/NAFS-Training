"use client";
import React, { useEffect } from "react";
import Link from "next/link";

const ShowStatistics = () => {
  const [students, setStudents] = React.useState([]);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchStudents = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("/api/students", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        // Parse the JSON data
        const data = await response.json();

        // Update the state with the fetched students
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    // Call the async function
    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to calculate the percentage for a single trial
  const calculateTrialPercentage = (score, numberOfQuestions) => {
    const maxScore = numberOfQuestions * 10; // Maximum possible score for the quiz
    return Math.round((score / maxScore) * 100); // Calculate percentage
  };

  // Function to calculate the average percentage across all trials
  const calculateAveragePercentage = (quizzes) => {
    if (!quizzes || quizzes.length === 0) return 0;

    const totalPercentage = quizzes.reduce((sum, quiz) => {
      const percentage = calculateTrialPercentage(quiz.score, quiz.quiz.quizQuestions.length);
      return sum + percentage;
    }, 0);

    return Math.round(totalPercentage / quizzes.length);
  };

  console.log(students);

  return (
    <div className="statistcs w-full mt-4 bg-theme h-full rounded-[4px]">
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
          {students.map((student, index) => {
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