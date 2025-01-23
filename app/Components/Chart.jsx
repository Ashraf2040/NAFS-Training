"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ code }) => {
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

  const currentStudent = students?.find((student) => student.code == code);
  const quizzes = currentStudent?.quizzes || [];

  // Get the latest 5 quiz attempts
  const latestQuizzes = quizzes.slice(-5);

  // Map quiz attempts to the required format for the charts
  const data = latestQuizzes.map((quiz) => ({
    name: `Trial ${quiz.trialNumber}`, // Use trialNumber instead of index
    Points: quiz.score, // Use the score for the chart
    Max: quiz.quiz.quizQuestions.length * 10, // Use the maximum possible score for the chart
  }));

  return (
    <div className='w-full h-full flex justify-center items-center'>
      {/* Line Chart */}
      <ResponsiveContainer width="50%" height="100%">
        <LineChart
          width={550}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Points" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* Composed Chart */}
      <ResponsiveContainer width="50%" height="100%">
        <ComposedChart
          width={550}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 20,
            bottom: 5,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Points" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="Max" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;