import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

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
      
      // Update or Create user with tokens in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          email: user.email,
          name: user.name,
          image: user.image,
          access_token: account?.access_token,
          refresh_token: account?.refresh_token,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        
      if (error) {
        console.error("Supabase upsert error:", error);
        return false;
      }
      
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
