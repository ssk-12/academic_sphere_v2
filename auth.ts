import NextAuth, { User as NextAuthUser, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      fullName: string;
    } & NextAuthUser;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
      
        if (!email || !password) {
          return null;
        }
      
        const user = await prisma.user.findUnique({ where: { email } });
      
        if (!user || !user.password) {
          return null;
        }
      
        const isMatched = await compare(password, user.password);
      
        if (!isMatched) {
          return null;
        }
      
        const userData = {
          name: user.fullName,
          email: user.email,
          role: user.role,
          id: user.id,
        };

        return userData;
      },
      
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      // Check if the user is authenticated
      if (token?.sub && token?.role) {
        // Assign user details to the session object
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        return session;
      } else {
        // If no user is authenticated, return null
        return null;
      }
    },
    

    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as string;
        token.name = (user as any).name as string; 
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image } = user;
          if (!email) {
            throw new Error("Email is required");
          }
          if (!name) {
            throw new Error("name is required");
          }
          const alreadyUser = await prisma.user.findUnique({ where: { email } });

          if (!alreadyUser) {
            await prisma.user.create({
              data: {
                email,
                image,
                authProviderId: account.providerAccountId,
                fullName: name
              },
            });
          }
          return true;
        } catch (error) {
          throw new Error("Error while creating user");
        }
      }

      if (account?.provider === "credentials") {
        if (!user) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    },
  },
});
