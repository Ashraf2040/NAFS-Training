import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDB();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 }); // Return a JSON response with status 200
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 }); // Return an error response with status 500
  }
};