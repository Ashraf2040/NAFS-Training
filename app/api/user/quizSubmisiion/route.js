import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { code, quiz, totalScore } = await req.json();

    if (!code || !quiz) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the user by their code
    const user = await prisma.user.findUnique({
      where: { code: Number(code) },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the latest trial number for this user and quiz
    const latestTrial = await prisma.userQuiz.findFirst({
      where: {
        userId: user.id,
        quizId: quiz._id,
      },
      orderBy: {
        trialNumber: 'desc', // Correctly order by trialNumber
      },
    });

    // Calculate the next trial number
    const trialNumber = latestTrial ? latestTrial.trialNumber + 1 : 1;

    // Save the quiz result to the UserQuiz table
    await prisma.userQuiz.create({
      data: {
        userId: user.id,
        quizId: quiz._id,
        score: quiz.score,
        userAnswers: quiz.userAnswers, // Store user answers as JSON
        trialNumber, // Store the trial number
      },
    });

    // Update the user's total score
    await prisma.user.update({
      where: { id: user.id },
      data: {
        score: {
          increment: totalScore, // Add the new quiz score to the user's existing score
        },
      },
    });

    return new Response(JSON.stringify({ message: 'Quiz results saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}