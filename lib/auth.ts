import { db } from "@/database/drizzle";
import { auth_schema } from "@/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, { 
        provider: 'pg',
        schema: auth_schema,
    }),
    user: {
        modelName: "users",
        fields: {
            id: "id",
            email: "email",
            name: "name",
            image: "image",
            emailVerified: "email_verified",
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        additionalFields: {
            role: { type: "string", input: false, defaultValue: "PATIENT" },
        },
    },

  session: {
    modelName: "sessions",
    fields: {
      id: "id",
      userId: "user_id",
      sessionToken: "session_token",
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  account: {
    modelName: "accounts",
    fields: {
      id: "id",
      userId: "user_id",
      provider: "provider",
      providerAccountId: "provider_account_id",
      type: "type",
      passwordHash: "password_hash",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      tokenExpiresAt: "token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    modelName: "verifications",
    fields: {
      id: "id",
      identifier: "identifier",
      token: "token",
      expiresAt: "expires_at",
      createdAt: "created_at",
    },
  },
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});