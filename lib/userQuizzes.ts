import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export const getUserQuizzes = async () => {
    try {
        const userQuizzes = await prisma.user.findMany({
            include: {
                quizzes: true,
            },
        });
        return userQuizzes;
    } catch (error) {
        console.error("Error fetching user quizzes:", error);
        throw error;
    }
};