import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const subject = searchParams.get('subject');

  // console.log("subject and code is ", code, subject);

  if (!code || !subject) {
    return new Response(JSON.stringify({ message: 'Code and subject are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch the student with their assignments and completed quizzes
    const student = await prisma.user.findUnique({
      where: { code: parseInt(code) },
      include: {
        assignments: {
          include: { quiz: true },
          where: {
            quiz: {
              subject: subject, // Filter assignments by subject
            },
          },
        },
        quizzes: {
          include: { quiz: true },
        },
      },
    });

    if (!student) {
      return new Response(JSON.stringify({ message: 'Student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process quiz statistics based on assigned quizzes only
    const quizStats = student.assignments.map((assignment) => {
      const quiz = assignment.quiz;
      const completedQuiz = student.quizzes.find((q) => q.quizId === quiz.id);

      return {
        quizTitle: quiz.quizTitle,
        assigned: true, // All quizzes here are assigned
        completed: !!completedQuiz,
        score: completedQuiz ? completedQuiz.score : null,
      };
    });

    return new Response(JSON.stringify(quizStats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}