"use server"

import { connectToDB } from "./mongoDB"
import User from "@/app/models/UserSchema";

export const getUser = async (req) => {
  await   connectToDB()
    const users = await User.find({req})
    return users
}