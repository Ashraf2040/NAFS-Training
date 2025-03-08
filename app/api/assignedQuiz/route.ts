import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Validate userId
  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }

  try {
    const quizzesAssigned = await prisma.quizAssignment.findMany({
      where: {
        userId: userId, // Filter by the specific userId
      },
      select: {
        quiz: {
          include: {
            quizQuestions: true, // Include quiz questions as requested
          },
        },
        status: true, // Include the status of the assignment
      },
    });

    return NextResponse.json({ quizzesAssigned });
  } catch (error) {
    
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the query
  }
}