import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const subject = formData.get('subject');
    const skill = formData.get('skill');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject is required' },
        { status: 400 }
      );
    }

    // Read the CSV file
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    // Group questions by quizId
    const quizzesMap = new Map();
    records.forEach((record) => {
      // Always generate a new UUID if quizId might conflict; alternatively, use a composite key if needed
      const quizId = record.quizId ? `${record.quizId}-${Date.now()}` : uuidv4();
      if (!quizzesMap.has(quizId)) {
        quizzesMap.set(quizId, {
          id: quizId,
          quizTitle: record.quizTitle,
          grade: "12", // Hardcoded for SAT
          subject: subject || record.subject,
          skill: skill || record.skill,
          icon: record.icon,
          scope: "SAT", // Hardcoded scope for SAT
          quizQuestions: [],
        });
      }
      const quiz = quizzesMap.get(quizId);
      quiz.quizQuestions.push({
        id: record.questionId ? `${record.questionId}-${Date.now()}` : uuidv4(),
        mainQuestion: record.mainQuestion,
        choices: record.choices.split('|'),
        correctAnswer: parseInt(record.correctAnswer) || 0,
        answeredResult: parseInt(record.answeredResult) || 0,
        statistics: {
          create: {
            totalAttempts: parseInt(record.totalAttempts) || 0,
            correctAttempts: parseInt(record.correctAttempts) || 0,
            incorrectAttempts: parseInt(record.incorrectAttempts) || 0,
          },
        },
      });
    });

    const quizzes = Array.from(quizzesMap.values());
    let successfulImports = 0;

    // Insert or update quizzes into the database
    for (const quiz of quizzes) {
      try {
        // Check if the quiz exists
        const existingQuiz = await prisma.quiz.findUnique({
          where: { id: quiz.id },
          include: { quizQuestions: true },
        });

        if (existingQuiz) {
          // If quiz exists, update metadata only
          await prisma.quiz.update({
            where: { id: quiz.id },
            data: {
              quizTitle: quiz.quizTitle,
              grade: quiz.grade,
              subject: quiz.subject,
              skill: quiz.skill,
              icon: quiz.icon,
              scope: quiz.scope,
            },
          });

          // Handle questions: update existing or create new with unique IDs
          for (const question of quiz.quizQuestions) {
            const existingQuestion = existingQuiz.quizQuestions.find(q => q.id === question.id);
            if (existingQuestion) {
              await prisma.quizQuestion.update({
                where: { id: question.id },
                data: {
                  mainQuestion: question.mainQuestion,
                  choices: question.choices,
                  correctAnswer: question.correctAnswer,
                  answeredResult: question.answeredResult,
                },
              });
              await prisma.statistic.updateMany({
                where: { quizQuestionId: question.id },
                data: {
                  totalAttempts: question.statistics.create.totalAttempts,
                  correctAttempts: question.statistics.create.correctAttempts,
                  incorrectAttempts: question.statistics.create.incorrectAttempts,
                },
              });
            } else {
              // Ensure question ID is unique by appending timestamp if needed
              let questionId = question.id;
              const questionExists = await prisma.quizQuestion.findUnique({
                where: { id: questionId },
              });
              if (questionExists) {
                questionId = `${question.id}-${Date.now()}`;
              }
              await prisma.quizQuestion.create({
                data: {
                  id: questionId,
                  quizId: quiz.id,
                  mainQuestion: question.mainQuestion,
                  choices: question.choices,
                  correctAnswer: question.correctAnswer,
                  answeredResult: question.answeredResult,
                  statistics: question.statistics,
                },
              });
            }
          }
        } else {
          // If quiz doesn't exist, create it with all questions, ensuring unique ID
          let finalQuizId = quiz.id;
          const quizExists = await prisma.quiz.findUnique({
            where: { id: finalQuizId },
          });
          if (quizExists) {
            finalQuizId = `${quiz.id}-${Date.now()}`;
          }
          await prisma.quiz.create({
            data: {
              id: finalQuizId,
              quizTitle: quiz.quizTitle,
              grade: quiz.grade,
              subject: quiz.subject,
              skill: quiz.skill,
              icon: quiz.icon,
              scope: quiz.scope,
              quizQuestions: {
                create: quiz.quizQuestions.map(q => ({
                  ...q,
                  id: `${q.id}-${Date.now()}`, // Ensure unique question IDs
                })),
              },
            },
          });
        }
        successfulImports++;
      } catch (error) {
        console.error(`Failed to process quiz: ${quiz.id}`, error);
      }
    }

    return NextResponse.json({
      message: 'SAT Quizzes import process completed',
      totalProcessed: quizzes.length,
      successfulImports: successfulImports,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
