import { requireAuth } from "@/lib/auth-utils";

const Page = async ({ params }: PageProps<"/executions/[executionId]">) => {
  const { executionId } = await params;
  await requireAuth();
  return <p>{executionId}</p>;
};

export default Page;
