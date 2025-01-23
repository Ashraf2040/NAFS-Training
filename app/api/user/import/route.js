import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const runtime = 'nodejs'; // Ensure the runtime is Node.js
export const dynamic = 'force-dynamic'; // Ensure the route is dynamically rendered

export async function POST(request) {
  try {
    // Parse the form data manually
    const formData = await request.formData();
    const file = formData.get('file') ;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    // Convert the file to a readable stream
    const fileStream = Readable.from(Buffer.from(await file.arrayBuffer()));

    const results= [];
    return new Promise((resolve) => {
      fileStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            for (const user of results) {
              await prisma.user.create({
                data: {
                  fullName: user.fullName,
                  email: user.email,
                  password: user.password, // Ensure to hash the password before saving
                  role: user.role,
                  code: parseInt(user.code),
                  grade: user.grade,
                },
              });
            }
            resolve(NextResponse.json({ message: 'Users imported successfully.' }, { status: 200 }));
          } catch (error) {
            resolve(
              NextResponse.json(
                { message: 'Failed to import users.', error: (error).message },
                { status: 500 }
              )
            );
          }
        })
        .on('error', (error) => {
          resolve(
            NextResponse.json(
              { message: 'Failed to parse CSV file.', error: error.message },
              { status: 500 }
            )
          );
        });
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to parse file upload.', error: error.message },
      { status: 500 }
    );
  }
}