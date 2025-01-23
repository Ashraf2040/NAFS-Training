import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a new quiz
export async function POST(request) {
  try {
    const { quizTitle, icon, quizQuestions, _id, quizAssets, grade, subject, skill } = await request.json();

    const newQuiz = await prisma.quiz.create({
      data: {
        id: _id, // Use _id as the custom ID
        quizTitle,
        icon,
        quizQuestions: {
          create: quizQuestions, // Create nested quizQuestions
        },
        quizAssets,
        grade,
        subject,
        skill,
      },
    });

    return NextResponse.json({
      id: newQuiz.id,
      message: 'The quiz has been created successfully.',
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Fetch all quizzes
export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { quizQuestions: true }, // Include nested quizQuestions
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Update a quiz
export async function PUT(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const { updateQuiz, updateQuizQuestions } = await request.json();

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        icon: updateQuiz?.icon,
        quizTitle: updateQuiz?.quizTitle,
        quizQuestions: updateQuizQuestions
          ? {
              deleteMany: {}, // Delete existing quizQuestions
              create: updateQuizQuestions, // Create new quizQuestions
            }
          : undefined,
      },
    });

    return NextResponse.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Delete a quiz
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}