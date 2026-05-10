import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    operatorId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    operatorId?: string;
  }
}
