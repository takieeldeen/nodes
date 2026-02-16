import { Router } from "express";
import authRouter from "./auth";

const PortalRouter = Router();

PortalRouter.use("/auth", authRouter);

export default PortalRouter;
