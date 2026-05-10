import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    user: {
      operatorId: string;
    } & DefaultSession["user"];
  }
  interface User {
    operatorId?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    operatorId?: string;
  }
}
