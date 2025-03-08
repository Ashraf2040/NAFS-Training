import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { parse } from 'json2csv';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const skill = searchParams.get('skill');
// console.log(grade,subject,skill)

    // Fetch quizzes with optional filters
    const quizzes = await prisma.quiz.findMany({
      where: {
        grade: grade || undefined,
        subject: subject || undefined,
        skill: skill || undefined,
      },
      include: { quizQuestions: true },
    });

    if (!quizzes.length) {
      return NextResponse.json(
        { message: 'No quizzes found' },
        { status: 404 }
      );
    }

    // Flatten the data for CSV export
    const flattenedQuizzes = quizzes.flatMap((quiz) =>
      quiz.quizQuestions.map((question) => ({
        quizId: quiz.id,
        quizTitle: quiz.quizTitle,
        icon: quiz.icon,
        questionId: question.id,
        mainQuestion: question.mainQuestion,
        choices: question.choices.join('|'), // Convert array to string
        correctAnswer: question.correctAnswer,
        answeredResult: question.answeredResult,
        totalAttempts: question.statistics.totalAttempts,
        correctAttempts: question.statistics.correctAttempts,
        incorrectAttempts: question.statistics.incorrectAttempts,
      }))
    );

    // Convert to CSV
    const csv = parse(flattenedQuizzes);

    // Generate dynamic filename
    const filename = `quizzes_${grade || 'all'}_${subject || 'all'}_${skill || 'all'}.csv`;

    // Set headers for file download
    const headers = {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'text/csv',
    };

    return new NextResponse(csv, { headers });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}