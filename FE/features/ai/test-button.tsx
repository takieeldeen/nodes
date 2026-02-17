"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

function TestButtonForAi({ disabled = false }: { disabled?: boolean }) {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(trpc.testAi.mutationOptions());
  return (
    <Button
      onClick={() => {
        mutate();
      }}
      disabled={isPending}
    >
      Test The AI
    </Button>
  );
}

export default TestButtonForAi;
