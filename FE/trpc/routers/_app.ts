import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const appRouter = createTRPCRouter({
  // testAi: protectedProcedure.mutation(async () => {
  //   const { text } = await generateText({
  //     model: google("gemini-2.5-flash"),
  //     prompt: "Write a vegetarian lasagna recipe for 4 people.",
  //   });
  //   return text;
  // }),
  testAi: protectedProcedure.mutation(async () => {
    const res = await inngest.send({ name: "execute/ai" });
    return res;
  }),
  getWorkflows: protectedProcedure.query(async ({ ctx }) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "takie.eldeen1998@gmail.com",
      },
    });
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(() => {
    return prisma.workflow.create({
      data: {
        name: "test-workflw",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
