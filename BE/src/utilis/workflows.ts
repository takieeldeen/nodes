import { Browser, Page } from "puppeteer";
import { STEPS_REGISTRY } from "../constants/workflows/stepsRegistry";
import db from "../db/config";
import { logCollector, loglevel, LogLevel } from "../types/logs";
import {
  AppNodeMissingInputs,
  ExecutionPhase,
  GlobalEnvironment,
  LocalEnvironment,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
} from "../types/workflows";
import { EXECUTOR_REGISTRY } from "../constants/workflows/executorsRegistry";

export function generateExecutionPlan(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
) {
  const planObj: {
    error: { type: string; invalidInputs: AppNodeMissingInputs[] } | null;
    plan:
      | {
          phase: number;
          nodes: WorkflowNode<Record<string, string>>[];
        }[]
      | null;
  } = {
    error: null,
    plan: null,
  };
  if (!nodes && !edges)
    return {
      error: "NO_WORKFLOW_DEFINITON",
      plan: null,
    };

  const entryPoint = nodes.find(
    (node) => STEPS_REGISTRY[node.data.type].isEntryPoint
  );
  if (!entryPoint) return { error: "NO_ENTRY_POINT_FOUND", plan: null };

  const inputsWithErrors: AppNodeMissingInputs[] = [];

  const plannedNodes = new Set<string>();

  const invalidInputs = validateNodeInputs(entryPoint, edges, plannedNodes);

  if (invalidInputs.length > 0)
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs.map((input) => input.nameEn),
    });

  const executionPlan = [{ phase: 1, nodes: [entryPoint] }];
  plannedNodes.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && plannedNodes.size <= nodes.length;
    phase++
  ) {
    const currentPhase: ExecutionPhase = { phase, nodes: [] };
    for (const node of nodes) {
      // Check if the current node is already planned
      if (plannedNodes.has(node.id)) continue;
      // Check if the current node has any invalid Inputs
      const invalidInputs = validateNodeInputs(node, edges, plannedNodes);
      if (invalidInputs.length > 0) {
        // Case A : the node is invalid because it's leading node is not yet planned
        const readyToRun = edges
          .filter((edge) => edge.target === node.id)
          .map((edge) => edge.source)
          .every((nodeId) => plannedNodes.has(nodeId));

        if (readyToRun) {
          inputsWithErrors.push({
            nodeId: node.id,
            inputs: invalidInputs.map((input) => input.nameEn),
          });
        } else {
          continue;
        }
      }
      // Check if the current node has no inputs
      if (STEPS_REGISTRY[node.data.type].inputs.length === 0) {
        currentPhase.nodes.push(node);
        continue;
      }
      currentPhase.nodes.push(node);
      // check if the current node inputs are already planned
    }

    for (const plannedNode of currentPhase.nodes) {
      plannedNodes.add(plannedNode.id);
    }
    executionPlan.push(currentPhase);
  }
  if (inputsWithErrors.length > 0) {
    planObj.error = {
      type: "INVALID_INPUTS",
      invalidInputs: inputsWithErrors,
    };
  } else {
    planObj.plan = executionPlan;
  }
  return planObj;
}

export function validateNodeInputs(
  node: WorkflowNode,
  edges: WorkflowEdge[],
  planned: Set<string>
) {
  const invalidInputs = [];
  const inputs = STEPS_REGISTRY[node.data.type].inputs;
  for (const input of inputs) {
    // Check if the input is not required
    if (!input.required) continue;
    // Check if the input is passed manually
    const manuallyPassedInput =
      !!node.data.inputs[input.nameEn] &&
      node.data.inputs[input.nameEn]!.length > 0;
    if (!!manuallyPassedInput) continue;
    // Check if the input is passed at Runtime
    const providingNode = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.nameEn
    )?.source;
    if (!!providingNode && planned.has(providingNode)) continue;
    invalidInputs.push(input);
  }
  return invalidInputs;
}

export async function executeNode(
  node: string,
  globalEnvironment: GlobalEnvironment,
  workflow: Workflow,
  userId: number | string
): Promise<{ success: boolean; creditsConsumed: number }> {
  const startedAt = new Date().toISOString();
  const parsedNode = JSON.parse(node) as WorkflowNode;
  const { edges } = workflow;
  if (!parsedNode) return { success: false, creditsConsumed: 0 };
  // Prepare the inputs required for the node
  globalEnvironment.nodes[parsedNode.id] = { inputs: {}, outputs: {} };
  const nodeInputs = STEPS_REGISTRY[parsedNode.data.type].inputs;
  if (nodeInputs.length > 0) {
    for (const input of nodeInputs) {
      // Check if the value passed manually
      const manuallyPassedInput = parsedNode.data.inputs[input.nameEn];
      if (!!manuallyPassedInput) {
        globalEnvironment.nodes[parsedNode.id]!.inputs[input.nameEn] =
          manuallyPassedInput;
        continue;
      }
      const connection = edges.find(
        (edge) =>
          edge.target === parsedNode.id && edge.targetHandle === input.nameEn
      );
      if (!connection) {
        console.error("MISSING EDGE FOR INPUT", input.nameEn, parsedNode.id);
        continue;
      }
      const runtimePassedInput =
        globalEnvironment.nodes[connection.source]?.outputs[
          connection.sourceHandle!
        ];

      globalEnvironment.nodes[parsedNode.id]!.inputs[input.nameEn] =
        runtimePassedInput!;
    }
  }
  // TO.DO add the inputs to the node in the database
  const creditsRequired = STEPS_REGISTRY[parsedNode.data.type].cost;

  // Decrement user balance
  const { rowCount } = await db.query(
    `
      UPDATE users.users 
      SET current_balance = current_balance - $1
      WHERE id = $2 AND current_balance >= $1
    `,
    [creditsRequired, userId]
  );
  if ((rowCount ?? 0) < 1) {
    return { success: false, creditsConsumed: 0 };
  }

  // Create the Log Execution requirement
  const logCollector = createLogCollector();
  const LocalEnvironment = createLocalEnvironment(
    globalEnvironment,
    parsedNode,
    logCollector
  );
  // Execute the node
  const executorFn = EXECUTOR_REGISTRY[parsedNode.data.type];
  if (!executorFn) {
    logCollector.error("No Executor Found for this step");
    return { success: false, creditsConsumed: creditsRequired };
  }
  const executed = await executorFn(LocalEnvironment);
  if (executed) return { success: true, creditsConsumed: creditsRequired };
  return { success: false, creditsConsumed: creditsRequired };
}

export function createLogCollector(): logCollector {
  const logs: { message: string; level: LogLevel; timestamp: Date }[] = [];
  const getAll = () => logs;
  const logFn = {} as Record<LogLevel, (msg: string) => void>;
  loglevel.forEach((level) => {
    logFn[level] = (message) =>
      logs.push({ level, message, timestamp: new Date() });
  });
  return { getAll, ...logFn };
}

export function createLocalEnvironment(
  globalEnvironment: GlobalEnvironment,
  node: WorkflowNode,
  logCollector: logCollector
): LocalEnvironment<any> {
  return {
    getBrowser: () => globalEnvironment.browser,
    getPage: () => globalEnvironment.page,
    setBrowser: (browser: Browser) => (globalEnvironment.browser = browser),
    setPage: (page: Page) => (globalEnvironment.page = page),
    getInput: (name: string) => globalEnvironment.nodes[node.id]?.inputs[name]!,
    setOutput: (name: string, val: string) =>
      (globalEnvironment.nodes[node.id]!.outputs[name] = val),
    log: logCollector,
  };
}
