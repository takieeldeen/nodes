import express, { json, NextFunction, Request, Response } from "express";
import PortalRouter from "./routers/portal";
import DashboardRouter from "./routers/dashboard";
import ErrorController from "./controllers/error";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/db";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(cookieParser());
app.use(json());
app.route("/api/v1/test").get(async (req, res, next) => {
  const users = await prisma.user.findMany();
  res.status(200).json({
    status: "It Works",
    users,
  });
});
app.use("/api/dashboard", DashboardRouter);
app.use("/api", PortalRouter);

app.use(ErrorController);
export default app;
