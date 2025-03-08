import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { fullName, email, password, code, role, grade } = await request.json();
// console.log(fullName,email,password,code,role,grade)
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { code },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
  

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        code,
        role,
        grade,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}