import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      await dbConnect();
      
      // Update or Create user with tokens
      await User.findOneAndUpdate(
        { email: user.email },
        { 
          name: user.name,
          image: user.image,
          ...(account?.access_token && { accessToken: account.access_token }),
          ...(account?.refresh_token && { refreshToken: account.refresh_token }),
        },
        { upsert: true, new: true }
      );
      
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
