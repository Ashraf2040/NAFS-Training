import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { code } = params; // Extract code from URL params
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject') || null;

  if (!code) {
    return NextResponse.json({ message: 'Code is required' }, { status: 400 });
  }

  try {
    const student = await prisma.user.findUnique({
      where: { code: parseInt(code) },
      include: {
        quizzes: {
          include: { quiz: { select: { quizTitle: true } } },
          ...(subject ? { where: { quiz: { subject } } } : {}),
        },
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Map quiz stats similar to admin route
    const quizStats = student.quizzes.map((userQuiz) => ({
      quizTitle: userQuiz.quiz.quizTitle,
      score: userQuiz.score,
      createdAt: userQuiz.createdAt,
      status: userQuiz.status,
      completed: userQuiz.status === 'COMPLETED',
    }));

    return NextResponse.json(quizStats, { status: 200 });
  } catch (error) {
    console.error('Error fetching student quiz stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
