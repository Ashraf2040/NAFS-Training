import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const grade = formData.get('grade');
    const subject = formData.get('subject');
    const skill = formData.get('skill');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Read the CSV file
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    // Transform CSV data into Prisma format
    const quizzes = records.map((record) => {
      return {
        id: record.id || uuidv4(), // Generate a UUID if id is missing
        quizTitle: record.quizTitle,
        grade: grade || record.grade,
        subject: subject || record.subject,
        skill: skill || record.skill,
        icon: record.icon,
        quizQuestions: {
          create: {
            id: record.questionId || uuidv4(), // Generate a UUID for the question
            mainQuestion: record.mainQuestion,
            choices: record.choices.split('|'),
            correctAnswer: parseInt(record.correctAnswer),
            answeredResult: parseInt(record.answeredResult),
            statistics: {
              create: {
                totalAttempts: parseInt(record.totalAttempts),
                correctAttempts: parseInt(record.correctAttempts),
                incorrectAttempts: parseInt(record.incorrectAttempts),
              },
            },
          },
        },
      };
    });

    // Insert quizzes into the database
    for (const quiz of quizzes) {
      try {
        await prisma.quiz.upsert({
          where: { id: quiz.id },
          update: quiz,
          create: quiz,
        });
      } catch (error) {
        console.error('Failed to upsert quiz:', quiz, error);
      }
    }

    return NextResponse.json({
      message: 'Quizzes imported successfully',
      count: quizzes.length,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}