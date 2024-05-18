import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    role?: string;
    user: {
      name: string;
      email: string;
      sub: string | undefined;
    };
  }

  interface Profile {
    extension_Rolle?: string;
    emails?: string;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken?: string;
    role?: string;
  }
}
