// app/api/students/route.ts

import { NextResponse } from 'next/server';
import {getStudentsWithQuizzes} from './../../../libs/actions';
 // Adjust the import path

export async function GET() {
  try {
    const students = await getStudentsWithQuizzes();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}