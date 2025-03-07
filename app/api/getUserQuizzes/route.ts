import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    const prisma = new PrismaClient();
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const userQuizzes = await prisma.userQuiz.findMany({
            where: { userId},
            // include: { quiz: true }, // لجلب تفاصيل الاختبار
        });

        return NextResponse.json({ userQuizzes });
    } catch (error) {
        console.error('Error fetching user quizzes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
