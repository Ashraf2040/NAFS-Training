import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');

    if (!grade || !subject) {
      return NextResponse.json(
        { message: 'Grade and subject are required' },
        { status: 400 }
      );
    }

    // Fetch unique skills from the quiz table
    const skills = await prisma.quiz.findMany({
      where: {
        grade: grade,
        subject: subject,
      },
      distinct: ['skill'],
      select: {
        skill: true,
      },
    });

    const skillList = skills.map((quiz) => quiz.skill);

    return NextResponse.json(skillList);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}