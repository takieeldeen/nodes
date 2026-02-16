import { NextFunction, Request, Response } from "express";
import { debugModeErrorHandler } from "../errors/errorHandler";

export class AppError extends Error {
  public isAppError: boolean = true;
  public statusCode: number = 400;
  public message: string;
  public stack?: string;
  public constructor(statusCode: number, msg: string) {
    super(msg);
    this.statusCode = statusCode;
    this.message = msg;
    Error.captureStackTrace(this, AppError);
  }
}

export default function ErrorController(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const debugModeActivated = process.env.DEBUG_MODE === "true";
  let handledError: any;
  if (debugModeActivated) {
    handledError = debugModeErrorHandler(error);
    return res.status(handledError.code).json(handledError);
  } else {
    handledError = debugModeErrorHandler(error);
    return res.status(handledError.code).json({
      status: handledError.status,
      message: handledError.message,
    });
  }
}
