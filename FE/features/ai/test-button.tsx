"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";

function TestButtonForAi() {
  const trpc = useTRPC();
  const testAi = useMutation(trpc.testAi.mutationOptions());
  return <Button onClick={() => testAi.mutate()}>Test The AI</Button>;
}

export default TestButtonForAi;
