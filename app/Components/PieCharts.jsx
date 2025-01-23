"use client";
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const PieCharts = ({ code }) => {
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

  // Calculate total correct and incorrect answers across all quizzes
  let totalCorrect = 0;
  let totalIncorrect = 0;

  quizzes.forEach((quiz) => {
    const correctAnswers = quiz.quiz.quizQuestions.map((question) => question.correctAnswer);
    const userAnswers = quiz.userAnswers;

    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        totalCorrect++;
      } else {
        totalIncorrect++;
      }
    });
  });

  // Calculate percentages
  const totalQuestions = totalCorrect + totalIncorrect;
  const correctPercentage = Math.round((totalCorrect / totalQuestions) * 100);
  const incorrectPercentage = 100 - correctPercentage;

  // Data for the pie chart
  const data = [
    { name: "Correct Answers", value: correctPercentage },
    { name: "Incorrect Answers", value: incorrectPercentage },
  ];

  const COLORS = ['#00C49F', '#FF8042']; // Green for correct, Orange for incorrect

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className='w-full h-full flex flex-col items-center'>
      {/* Pie Chart */}
      <div className='w-full h-[80%]'>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={800} height={800}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              align="center"
              verticalAlign="bottom"
              layout="horizontal"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieCharts;