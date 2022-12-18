import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "../../../lib/prismadb";

export const authOptions = {
  // Ensure we can store user data in a database.
  adapter: PrismaAdapter(prisma),
  providers: [
    // Register a Discord auth method.
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    // Register an email magic link auth method.
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    /**
     * Includes the raw user id in the session object.
     */
    async session({ session, token, user }) {
      session.user.id = user.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
