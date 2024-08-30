
import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

connectToDB();

export async function POST(request) {
  try {
    const { fullName, email, password ,code,role  } = await request.json();

    const user = await User.findOne({ code });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // const salt = await bcryptjs.genSalt(10);
    // const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password,
      code,
      role
      
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}