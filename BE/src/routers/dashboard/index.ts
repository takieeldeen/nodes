import { Router } from "express";
import SecretsRouter from "./secrets";
import workflowsRouter from "./workflows";
import tagsRouter from "./tags";

const DashboardRouter = Router();

DashboardRouter.use("/secrets", SecretsRouter);
DashboardRouter.use("/workflows", workflowsRouter);
DashboardRouter.use("/tags", tagsRouter);

export default DashboardRouter;
