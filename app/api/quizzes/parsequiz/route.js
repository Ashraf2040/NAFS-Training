import Quiz from "@/app/models/QuizSchema";
import { connectToDB } from "@/libs/mongoDB";


import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToDB();
  const datareceived = await request.json();


  console.log("your data is ",datareceived);
  const { quizTitle, icon, quizQuestions ,id} = datareceived.quiz;
  const { subject, grade, skill } = datareceived;
    console.log(quizTitle, icon, quizQuestions, subject, grade, skill)
  // Add data validation here
  if (!quizTitle || !icon || !quizQuestions || !subject || !grade || !skill) {
    return NextResponse.json({
      message: "Missing required fields.",
      status: 400,
    });
  }

  const newQuiz = await Quiz.create({ quizTitle, icon, quizQuestions, subject, grade, skill,_id:id });

  try {
    return NextResponse.json({
      id: newQuiz._id,
      message: "The quiz has been created successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
}