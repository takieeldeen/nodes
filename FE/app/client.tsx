"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function Client() {
  const { useSession, signOut } = authClient;
  const { data: session } = useSession();
  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
      {!!session && <Button onClick={() => signOut()}>Log Out</Button>}
    </div>
  );
}
