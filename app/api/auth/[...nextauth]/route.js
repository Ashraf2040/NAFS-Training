
import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bycrptjs from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials 
        // console.log("current email is:",email,password)
        try {
          await connectToDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          // const passwordsMatch = await bycrptjs.compare(
          //   password,
          //   user.password
          // );
          // if (!passwordsMatch) {
          //   return null;
          // }
          return user;
        } catch (error) {
          console.log("Error:", error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET 
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const { name, email } = user;
          await connectToDB();
          const ifUserExists = await User.findOne({ email });
          if (ifUserExists) {
            return user;
          }
          const newUser = new User({
            name: name,
            email: email,
          });
          const res = await newUser.save();
          if (res.status === 200 || res.status === 201) {
            // console.log(res)
            return user;
          }

        } catch (err) {
          console.log(err);
        }
      }
      return user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.fullName;
        token.score=user.score
        token.code=user.code
        token.role=user.role
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.fullName = token.fullName;
        session.user.score=token.score
        session.user.code=token.code
        session.user.role=token.role
      }
      // console.log(session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };










































































































































// import User from "@/app/models/UserSchema";
// import { connectToDB } from "@/libs/mongoDB";
// // import { NextRequest ,NextResponse } from "next/server";

// import { toast } from "react-toastify";

// connectToDB();

// export const POST = async (req) => {
//   const { username, email, password } = await req.json();
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       toast("this user is in our database");
//     }
//     const salt = bcrypt.genSalt(10);
//     const hashedPassword = bcrypt.hash(password, salt);
//     const newUser = new User({
//       username,
//       password: hashedPassword,
//       email,
//     });

//     await newUser.save();
//     return toast("User is successfully registered");
//   } catch (error) {
//     toast("There is Some Error While registering");
//   }
// };
