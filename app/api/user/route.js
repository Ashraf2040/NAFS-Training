import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const { code, quiz } = await req.json();

    // Find the user by code
    const user = await prisma.user.findUnique({
      where: { code },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the quiz already exists in the user's quizzes
    const quizExists = user.quizzes.some((q) => q.id === quiz.id);

    if (quizExists) {
      return NextResponse.json(
        { message: 'Quiz already exists for this user' },
        { status: 400 }
      );
    }

    // Update the user's quizzes
    const updatedQuizzes = [...user.quizzes, quiz];

    const updatedUser = await prisma.user.update({
      where: { code },
      data: {
        quizzes: updatedQuizzes,
      },
    });

    return NextResponse.json({
      message: 'Quiz added successfully',
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
};