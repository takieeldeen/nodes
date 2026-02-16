import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
  const data = await caller.getUsers();
  await requireAuth();
  return (
    <main>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </main>
  );
}
