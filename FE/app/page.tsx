import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading....</p>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
