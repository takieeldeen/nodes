import { Router } from "express";
import {
  createSecret,
  deleteSecret,
  getUserSecrets,
} from "../../controllers/secrets";
import { checkAuth } from "../../utilis/auth";
import {
  createWorkflow,
  getAllUserWorkflows,
  getWorkflowDetails,
  runWorkflow,
  updateWorkflow,
} from "../../controllers/workflows";

const workflowsRouter = Router();

workflowsRouter.use(checkAuth);
workflowsRouter.route("/").post(createWorkflow).get(getAllUserWorkflows);

workflowsRouter
  .route("/:workflowId")
  .get(getWorkflowDetails)
  .patch(updateWorkflow);

workflowsRouter.post("/run-workflow/:workflowId", runWorkflow);
// workflowsRouter.route("/:secretId").delete(deleteSecret);

export default workflowsRouter;
