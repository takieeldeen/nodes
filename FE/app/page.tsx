"use client";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
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
      <Button disabled={isPending} onClick={() => mutate()}>
        Create
      </Button>
    </main>
  );
}
