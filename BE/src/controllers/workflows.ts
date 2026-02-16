import { STEPS_REGISTRY } from "../constants/workflows/stepsRegistry";
import {
  EXECUTION_STATUS,
  NODE_STATUS,
} from "../constants/workflows/workflowExecutions";
import db from "../db/config";
import { GlobalEnvironment, Workflow, WorkflowNode } from "../types/workflows";
import { catchAsync } from "../utilis/catchAsync";
import { executeNode, generateExecutionPlan } from "../utilis/workflows";
import { AppError } from "./error";

export const createWorkflow = catchAsync(async (req, res, next) => {
  const userId = req?.user?.id;
  const { name_ar, name_en, description_ar, description_en, tags } =
    req?.body ?? {};
  console.log(req.body);
  const { rows } = await db.query(
    `INSERT INTO tasks.tasks (name_ar,name_en,description_ar,description_en,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [name_ar, name_en, description_ar, description_en, userId]
  );
  const taskId = rows?.[0]?.id;
  if (tags.length > 0) {
    const statement =
      "INSERT INTO tasks.task_tags (task_id,tag_id) VALUES " +
      tags.map((tag: number, i: number) => `($1,$${i + 2})`)?.join(",");
    console.log(statement);
    await db.query(statement, [taskId, ...tags]);
  }
  return res.status(201).json({
    status: "success",
  });
});

export const getAllUserWorkflows = catchAsync(async (req, res, next) => {
  const { page, size } = req.query;
  const userId = req.user?.id;
  const finalPage = +(page ?? 1);
  const finalSize = +(size ?? 9);
  const skippedRows = (finalPage - 1) * finalSize;

  const { rows } = await db.query(
    `SELECT
    tk.id,
    tk.name_ar,
    tk.name_en,
    tk.description_ar,
    tk.description_en,
    COALESCE(
      ARRAY_AGG(tg.name) FILTER (WHERE tg.id IS NOT NULL),
      '{}'
    ) AS tags
  FROM tasks.tasks tk
  LEFT JOIN tasks.task_tags tktg ON tk.id = tktg.task_id
  LEFT JOIN tasks.tags tg ON tktg.tag_id = tg.id
  WHERE tk.user_id = $3
  GROUP BY tk.id
  ORDER BY tk.id DESC
  OFFSET $1
  LIMIT $2;
    `,
    [skippedRows, finalSize, userId]
  );

  const countQuery = await db.query(
    `SELECT COUNT(id) FROM tasks.tasks WHERE user_id = $1`,
    [userId]
  );

  res.status(200).json({
    status: "success",
    results: countQuery?.rowCount,
    content: rows,
  });
});

export const runWorkflow = catchAsync(async (req, res, next) => {
  const { definition } = req.body;
  const { workflowId } = req.params;
  if (!definition && !workflowId)
    return next(new AppError(400, "WORKFLOW_DEFINITION_NOT_FOUND"));
  let finalDefinition: string = "";
  if (!workflowId && !!definition) {
    finalDefinition = definition;
  } else if (!!workflowId && !!definition) {
    finalDefinition = definition;
  } else if (!!workflowId && !definition) {
    // TODO : Lookup for task definition
  }
  const flow = JSON.parse(finalDefinition) as Workflow;
  // 1. TODO : Generate and Validate Execution Plan for the workflow
  const { plan, error } = generateExecutionPlan(flow.nodes, flow.edges);
  // 2. Add new record in task runs
  const { rows } = await db.query(
    `
      INSERT INTO tasks.tasks_runs 
      (task_id,user_id,trigger,status,definition)
      VALUES($1,$2,$3,$4,$5) RETURNING id 
    `,
    [
      workflowId,
      req.user!.id,
      "MANUAL",
      EXECUTION_STATUS.PENDING,
      finalDefinition,
    ]
  );
  const [run] = rows;
  const runId = run.id;
  const nodes = plan?.flatMap((phase) => phase.nodes);

  // Insert the nodes of the current execution
  await db.query(
    `INSERT INTO tasks.tasks_nodes (node,name_en,name_ar,run_id,user_id,status)
     SELECT * FROM UNNEST(
        $1::text[],
        $2::text[],
        $3::text[],
        $4::int[],
        $5::int[],
        $6::text[]
        )
    `,
    [
      nodes?.map((node) => JSON.stringify(node)),
      nodes?.map((node) => STEPS_REGISTRY[node.data.type].titleEn),
      nodes?.map((node) => STEPS_REGISTRY[node.data.type].titleAr),
      nodes?.map(() => runId),
      nodes?.map(() => req.user!.id),
      nodes?.map(() => NODE_STATUS.PENDING),
    ]
  );
  // Initiate state variables
  let creditsConsumed = 0;
  let globalEnvironment: GlobalEnvironment = { nodes: {} };
  let workflowFailed = false;

  // Change the workflow run status
  await db.query(
    `
      UPDATE tasks.tasks_runs 
      SET 
      status = $1,
      started_at = $2 
      WHERE id = $3 AND user_id = $4 
    `,
    [EXECUTION_STATUS.RUNNING, new Date().toISOString(), runId, req.user!.id]
  );

  // Change the workflow last run props
  await db.query(
    `
      UPDATE tasks.tasks
      SET 
      last_run_status = $1,
      last_run_id = $2,
      last_run_at = $3
      WHERE id = $4 AND user_id = $5 
    `,
    [
      EXECUTION_STATUS.RUNNING,
      runId,
      new Date().toISOString(),
      workflowId,
      req.user!.id,
    ]
  );

  // Change all the nodes status to pending
  await db.query(
    `
      UPDATE tasks.tasks_nodes
      SET 
      status = $1 
      WHERE run_id = $2 AND user_id = $3
    `,
    ["PENDING", runId, req.user!.id]
  );

  // Get the workflow Nodes
  const { rows: workflowNodes } = await db.query(
    `
      SELECT * FROM tasks.tasks_nodes WHERE user_id = $1 AND run_id = $2
    `,
    [req.user!.id, runId]
  );
  console.log(workflowNodes);
  for (const node of workflowNodes as { node: string }[]) {
    const nodeExecution = await executeNode(
      node.node,
      globalEnvironment,
      flow,
      req.user!.id
    );
    if (!nodeExecution.success) {
      console.error("Node Execution failed");
      break;
    }
  }

  res.status(200).json({ plan, error });
});

export const getWorkflowDetails = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const { rows } = await db.query("SELECT * FROM tasks.tasks WHERE id = $1", [
    workflowId,
  ]);

  const [workflow] = rows;
  res.status(200).json({
    status: "success",
    content: workflow,
  });
});

export const updateWorkflow = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const { definition, name_ar, name_en, description_ar, description_en } =
    req.body;
  await db.query(
    `UPDATE tasks.tasks 
     SET 
     name_ar = COALESCE(NULLIF($1,''),name_ar) ,
     name_en =  COALESCE(NULLIF($2,''),name_en),
     description_ar = COALESCE(NULLIF($3,''),description_ar),
     description_en = COALESCE(NULLIF($4,''),description_en),
     definition = COALESCE(NULLIF($5,''),definition)
     WHERE id = $6`,
    [name_ar, name_en, description_ar, description_en, definition, workflowId]
  );
  res.status(200).json({
    status: "success",
  });
});
