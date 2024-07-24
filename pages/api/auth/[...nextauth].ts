
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      AzureADProvider({
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
        tenantId: `${process.env.TENANT}`,
        authorization: {
          params: {
            scope:
              "openid email profile user.Read",
          },
        },
      }),
    ],
    session: {
      maxAge: 1 * 60 * 60
    },
    pages: {
        signIn: "/auth/signin",
    },
  
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.id = account.id;
          token.accessToken = account.access_token;
        }
        return token;
      },
      session({ session, token }: any) {
        session.user = token;
        return session;
      },
    },
  };

export default NextAuth(authOptions);