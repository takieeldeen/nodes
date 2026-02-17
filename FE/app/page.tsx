import TestButtonForAi from "@/features/ai/test-button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const { data, refetch } = useQuery(trpc.getWorkflows.queryOptions());
  const { isPending, mutate } = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => refetch(),
    }),
  );
  // const data = await caller.getUsers();
  return (
    <main>
      <h1>All Worfklows</h1>
      <pre>{JSON.stringify(data, null, 4)}</pre>
      <TestButtonForAi />
    </main>
  );
}
