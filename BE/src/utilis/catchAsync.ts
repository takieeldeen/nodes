import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../types/users";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function catchAsync(reqHandler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await reqHandler(req, res, next);
    } catch (err: any) {
      next(err);
    }
  };
}
