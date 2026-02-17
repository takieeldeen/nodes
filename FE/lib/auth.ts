import { betterAuth } from "better-auth";
import {
  checkout,
  portal,
  usage,
  webhooks,
  polar,
} from "@polar-sh/better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import polarClient from "./polar";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "b2075dd5-6962-45bb-bc0f-08750d092b34",
              slug: "Flow-Testing", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Flow-Testing
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
      ],
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
