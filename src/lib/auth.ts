import type { NextAuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/", // Custom sign in page
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    AzureADB2CProvider({
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET || "",
      primaryUserFlow: process.env.NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW,
      authorization: {
        params: {
          scope: "offline_access openid",
        },
      },
      checks: ["pkce"],
      client: {
        token_endpoint_auth_method: "none",
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account && profile) {
        return true;
      }
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.id_token;
      }
      if (user) {
        // token.role = user.role;
        // token.subscribed = user.subscribed;
      }
      if (profile) {
        token.role = profile?.extension_Rolle;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.role = token.role;
      session.user.sub = token.sub;

      return session;
    },
  },
};
