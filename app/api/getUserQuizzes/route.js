import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Force this route to be dynamic (server-rendered at runtime)
export const dynamic = "force-dynamic";

export async function GET(req) {
  const prisma = new PrismaClient();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userQuizzes = await prisma.userQuiz.findMany({
      where: { userId },
      // Uncomment the following line if you want to include quiz details
      // include: { quiz: true },
    });

    return NextResponse.json({ userQuizzes });
  } catch (error) {
   
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after use
  }
}