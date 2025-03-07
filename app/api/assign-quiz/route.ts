import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { quizId, grade, dueDate } = await req.json();

    if (!quizId || !grade) {
      return NextResponse.json({ message: "Quiz ID and grade are required." }, { status: 400 });
    }

    // Find all students with the selected grade
    const students = await prisma.user.findMany({
      where: { grade, role: "ST" },
    });

    if (!students.length) {
      return NextResponse.json({ message: "No students found for this grade." }, { status: 404 });
    }

    // Set default due date if not provided
    const defaultDueDate = dueDate ? new Date(dueDate) : new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7); // Default to 7 days from now

    // Create quiz assignments for all students in the grade
    const assignments = students.map(student => ({
      userId: student.id,
      quizId,
      dueDate: defaultDueDate, // Ensure dueDate is included
    }));

    await prisma.quizAssignment.createMany({
      data: assignments,
    });

    return NextResponse.json({ message: "Quiz assigned successfully." });

  } catch (error) {
    console.error("Error assigning quiz:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
