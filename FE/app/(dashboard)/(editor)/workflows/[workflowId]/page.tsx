import { requireAuth } from "@/lib/auth-utils";
import React from "react";

async function WorkflowEditorPage({
  params,
}: PageProps<"/workflows/[workflowId]">) {
  await requireAuth();
  const { workflowId } = await params;
  return <div>Workflow Id: {workflowId}</div>;
}

export default WorkflowEditorPage;
