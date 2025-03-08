import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a quiz from parsed data
export async function POST(request) {
  try {
    const datareceived = await request.json();
    const { quizTitle, icon, quizQuestions, id } = datareceived.quiz;
    const { subject, grade, skill } = datareceived;
// console.log(quizTitle,icon,quizQuestions,id,subject,grade,skill)
    // Validate required fields
    if ( !quizQuestions || !subject || !grade || !skill) {
      return NextResponse.json(
        { message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Create the quiz
    const newQuiz = await prisma.quiz.create({
      data: {
        quizTitle,
        icon:"faQuestion",
        quizQuestions: {
          create: quizQuestions, // Create nested quizQuestions
        },
        subject,
        grade,
        skill,
      },
    });

    return NextResponse.json({
      id: newQuiz.id,
      message: 'The quiz has been created successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}