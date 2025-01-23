import { PrismaClient } from '@prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';


const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { email , password},
          });

          if (!user) {
            return null;
          }

         

          return user;
        } catch (error) {
          console.log('Error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          const { name, email } = user;

          const ifUserExists = await prisma.user.findUnique({
            where: { email },
          });

          if (ifUserExists) {
            return user;
          }

          const newUser = await prisma.user.create({
            data: {
              fullName: name,
              email,
            },
          });

          if (newUser) {
            return user;
          }
        } catch (err) {
          console.log(err);
          return null;
        }
      }
      return user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.fullName;
        token.score = user.score;
        token.code = user.code;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.fullName = token.name;
        session.user.score = token.score;
        session.user.code = token.code;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };