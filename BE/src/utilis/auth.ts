import { hash } from "bcrypt";
import crypto from "crypto";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import db from "../db/config";
import { User } from "../types/users";

export async function generateVerificationToken() {
  const plain = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(plain).digest("hex");
  return { plain, hashed };
}

export async function generateJWTToken(res: Response, payload: any) {
  const cookiesSettings: CookieOptions = {
    maxAge: +(process.env.SESSION_DURATION ?? 1000 * 1000 * 60 * 60 * 24 * 7),
    httpOnly: true,
    secure: true,
  };
  const token = sign(payload, process.env.JWT_SECRET!);
  res.cookie("token", token, cookiesSettings);
}

export type ProtectedRequest = Request & {
  user: User;
};

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.cookies ?? {};
  const id = token ? (jwt.decode(token) as { id: number })?.id : null;
  if (!id)
    res.status(401).json({
      status: "fail",
      message: "USER_NOT_AUTHENTICATED",
    });
  const { rows } = await db.query(
    `SELECT * FROM users.users WHERE id = $1 AND is_email_verified = true AND deleted_at IS NULL`,
    [id]
  );
  const [user] = rows;
  if (!user)
    res.status(401).json({
      status: "fail",
      message: "USER_NOT_AUTHENTICATED",
    });
  req.user = user;
  next();
}
