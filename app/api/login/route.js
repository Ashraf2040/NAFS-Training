import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();
    console.log(email, password);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'The user does not exist' },
        { status: 400 }
      );
    }

    // Compare the provided password with the plain-text password in the database
    if (password !== user.password) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 400 }
      );
    }

    // Create token data
    const tokenData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      code: user.code,
      score: user.score,
      role: user.role,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.NEXT_SECRET, {
      expiresIn: '360s',
    });

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });

    // Set the token in cookies
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};