import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const  getStudentsWithQuizzes = async ()=> {
  const students = await prisma.user.findMany({
    where: {
      role: 'ST', // Filter by role = "ST"
    },
    include: {
      quizzes: {
        include: {
          quiz: {
            include: {
              quizQuestions: true, // Include quizQuestions in the quiz details
            },
          },
        },
      },
    },
  });

  return students;
}