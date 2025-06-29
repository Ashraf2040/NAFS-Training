import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { quiz, scope } = await req.json();

    if (!quiz || !quiz.title || !quiz.questions) {
      return NextResponse.json(
        { error: "Invalid quiz data provided" },
        { status: 400 }
      );
    }

    // Create or update the quiz in the database
    const quizId = uuidv4();
    const createdQuiz = await prisma.quiz.upsert({
      where: { id: quizId },
      update: {
        quizTitle: quiz.title,
        grade: quiz.standard || "Default Grade",
        subject: quiz.subject || "Default Subject",
        skill: quiz.skill || "Default Skill",
        icon: quiz.icon || "faQuestion",
        scope: scope || "SAT", // Set scope to SAT as requested
        quizQuestions: {
          create: quiz.questions.map((q, i) => ({
            id: q.id || uuidv4(),
            mainQuestion: q.text || "Untitled Question",
            choices: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
            answeredResult: -1, // Default as per schema
          })),
        },
      },
      create: {
        id: quizId,
        quizTitle: quiz.title,
        grade: quiz.standard || "Default Grade",
        subject: quiz.subject || "Default Subject",
        skill: quiz.skill || "Default Skill",
        icon: quiz.icon || "faQuestion",
        scope: scope || "SAT", // Set scope to SAT as requested
        quizQuestions: {
          create: quiz.questions.map((q, i) => ({
            id: q.id || uuidv4(),
            mainQuestion: q.text || "Untitled Question",
            choices: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
            answeredResult: -1, // Default as per schema
          })),
        },
      },
    });

    return NextResponse.json({
      message: `Quiz "${createdQuiz.quizTitle}" imported successfully with ID: ${createdQuiz.id}`,
      quizId: createdQuiz.id,
    });
  } catch (error) {
    console.error("Error importing quiz:", error);
    return NextResponse.json(
      { error: `Failed to import quiz: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
