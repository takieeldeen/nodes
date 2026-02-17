import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
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
