import { db } from "@/database/drizzle";
import { auth_schema } from "@/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: auth_schema,
  }),

  user: {
    modelName: "users",
    fields: {
      id: "id",
      email: "email",
      name: "name",
      image: "image",
      emailVerified: "emailVerified",  
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "patient" },
    },
  },

  session: {
    modelName: "sessions",
    fields: {
      id: "id",
      userId: "userId",               
      sessionToken: "token",        
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },

  account: {
    modelName: "accounts",
    fields: {
      id: "id",
      userId: "userId",
      provider: "providerId",         
      providerAccountId: "accountId", 
      passwordHash: "password",       
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      tokenExpiresAt: "accessTokenExpiresAt", 
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },

  verification: {
    modelName: "verifications",
    fields: {
      id: "id",
      identifier: "identifier",
      token: "value",                 
      expiresAt: "expiresAt",
      createdAt: "createdAt",
    },
  },

  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});
