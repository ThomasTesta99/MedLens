import { db } from "@/database/drizzle";
import { auth_schema } from "@/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendEmail, sendVerification } from "./email";

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
    deleteUser: { 
      enabled: true
    },
    changeEmail: {
      enabled: true, 
      sendChangeEmailVerification: async ({user, newEmail, url, token}, request) => {
        await sendVerification({
          to: user.email, 
          subject: "Approve email change", 
          templateParams: {
            user_name: user.name ?? "there", 
            action_url: url, 
            type: "Approve email change",
          }
        })
      }
    }
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

  emailAndPassword: { 
    enabled: true,
    sendResetPassword: async ({user, url}, request) => {
      await sendEmail({
        to: user.email, 
        resetLink: url,
      })
    } 
  },

  emailVerification: {
    sendVerificationEmail: async ({user, url, token}, request) =>{
      await sendVerification({
        to: user.email, 
        subject: "Verify your email", 
        templateParams:{
          user_name: user.name ?? "there", 
          action_url: url, 
          type: "Verify your email",
        } 
        
      })
    }
  },
  plugins: [nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});
