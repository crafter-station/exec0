import { prisma, redis } from "@exec0/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { organization } from "better-auth/plugins";
import { reservedSlugs } from "../const";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  appName: "Exec0",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    vercel: {
      clientId: process.env.VERCEL_CLIENT_ID as string,
      clientSecret: process.env.VERCEL_CLIENT_SECRET as string,
      scope: ["email", "profile"],
    },
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { EX: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    organization({
      organizationHooks: {
        beforeCreateOrganization: async (data) => {
          if (
            reservedSlugs.includes(data.organization.slug?.toLowerCase() || "")
          ) {
            throw new Error(
              `The slug "${data.organization.slug}" is reserved and cannot be used`,
            );
          }
          return {
            data: {
              ...data.organization,
            },
          };
        },
      },
    }),
    nextCookies(),
  ],
});
