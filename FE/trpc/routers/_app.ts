import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async () => {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Write a vegetarian lasagna recipe for 4 people.",
    });
    return text;
  }),
  getUsers: protectedProcedure.query(({ ctx }) => {
    console.log({ userId: ctx.auth.user.id });
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
