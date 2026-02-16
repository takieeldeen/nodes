import { NextFunction, Request, Response } from "express";
import db from "../db/config";
import bcrypt from "bcrypt";
import { catchAsync } from "../utilis/catchAsync";
import { AppError } from "./error";
import { generateMailTemplate, sendMail } from "../utilis/mails";
import {
  generateJWTToken,
  generateVerificationToken,
  ProtectedRequest,
} from "../utilis/auth";
import crypto from "crypto";

export const signup = catchAsync(async function signup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password, passwordConfirmation, name } = req.body;
  // Guard Clauses
  if (!email || !password)
    return next(new AppError(400, "EMAIL_AND_PASSWORD_REQUIRED"));
  if (password !== passwordConfirmation)
    return next(new AppError(400, "PASSWORDS_DO_NOT_MATCH"));

  const hashedPassword = await bcrypt.hash(password, 12);

  const { plain, hashed } = await generateVerificationToken();

  await db
    .query(
      "INSERT INTO users.users (email, password, name, provider, verification_token, verification_token_expiration) VALUES($1,$2,$3,$4,$5,NOW() + INTERVAL '1 day')",
      [email, hashedPassword, name, "local", hashed],
    )
    .catch((err) => {
      if (err.code === "23505")
        return next(new AppError(400, "USER_ALREADY_EXISTS"));
      throw err;
    });

  await sendMail({
    from: "Massar <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Massar — Get Started",
    html: generateMailTemplate({
      title: "Welcome to Massar",
      user: name,
      content:
        "Your account has been successfully created. Massar helps you design, automate, and manage workflows with clarity and control—so you can focus on outcomes, not overhead.",
      actionSubtitle:
        "To complete your setup and secure your account, please verify your email address by clicking the button below.",
      actionTitle: "Verify Your Account",
      actionLink: `${process.env.CLIENT_URL}/verify-email?token=${plain}`,
    }),
  });

  res.status(201).json({
    status: "success",
    message: "Verification Email Sent",
  });
});

export const verifyEmail = catchAsync(async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { token } = req.query;
  if (!token) return next(new AppError(400, "TOKEN_IS_MANDATORY"));
  const hashedToken = crypto
    .createHash("sha256")
    .update(token as string)
    .digest("hex");
  const { rows } = await db.query(
    `SELECT id,verification_token,verification_token_expiration,email FROM users.users WHERE verification_token = $1`,
    [hashedToken],
  );
  const [user] = rows;

  if (!user) return next(new AppError(400, "INVALID_TOKEN"));

  if (new Date(user.verification_token_expiration) < new Date())
    return next(new AppError(400, "EXPIRED_TOKEN"));

  await db.query(
    `UPDATE users.users SET is_email_verified = true, email_verified_at = CURRENT_TIMESTAMP, last_login_at = CURRENT_TIMESTAMP, verification_token_expiration = NULL, verification_token= NULL WHERE email = $1`,
    [user.email],
  );
  generateJWTToken(res, { id: user.id });
  console.log("PASSED");
  res.redirect(`${process.env.CLIENT_URL}/workflows`);
});

export const resendToken = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.body;
  if (!email) return next(new AppError(400, "EMAIL_IS_MANDATORY"));
  const { rows } = await db.query(
    `SELECT id,name,verification_token,verification_token_expiration FROM users WHERE email = $1 AND is_email_verified = false `,
    [email],
  );
  const [user] = rows;

  if (!user) return next(new AppError(400, "INVALID_EMAIL"));

  const { plain, hashed } = await generateVerificationToken();

  await db.query(
    `UPDATE users.users SET 
    verification_token_expiration = CURRENT_TIMESTAMP + INTERVAL '1 day',
    verification_token=$1
    WHERE email=$2`,
    [hashed, email],
  );
  await sendMail({
    from: "Massar <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Massar — Get Started",
    html: generateMailTemplate({
      title: "Welcome to Massar",
      user: user.name,
      content:
        "Your account has been successfully created. Massar helps you design, automate, and manage workflows with clarity and control—so you can focus on outcomes, not overhead.",
      actionSubtitle:
        "To complete your setup and secure your account, please verify your email address by clicking the button below.",
      actionTitle: "Verify Your Account",
      actionLink: `${process.env.CLIENT_URL}/verify-email?token=${plain}`,
    }),
  });

  res.status(200).json({
    status: "success",
    message: "Mail Sent",
  });
});

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body ?? {};
    // Check if email and password are given
    if (!email || !password)
      return next(new AppError(400, "EMAIL_AND_PASSWORD_ARE_MANDATORY"));
    // Get the user data
    const { rows } = await db.query(
      "SELECT id,name, password, failed_login_attempts,account_locked_until, is_email_verified FROM users.users WHERE email = $1",
      [email],
    );
    const [userData] = rows;

    // Check if the user exists (if email exists)
    if (!userData) return next(new AppError(400, "WRONG_CREDENTIALS"));
    if (!userData.is_email_verified)
      return next(new AppError(400, "VERIFY_EMAIL_FIRST"));
    // Check for failed attempts
    const attemptsExceeded = userData?.failed_login_attempts >= 3;
    const accountStillLocked =
      new Date(userData.account_locked_until) > new Date();

    if (attemptsExceeded && accountStillLocked) {
      return next(new AppError(400, "LOGIN_LIMIT_EXCEEDED"));
    }

    const valid = await bcrypt.compare(password, userData.password);

    // General Query
    await db.query(
      `
        UPDATE users.users
        SET failed_login_attempts = CASE
        WHEN $1 = true THEN 0
        WHEN account_locked_until <= CURRENT_TIMESTAMP THEN 1
        ELSE failed_login_attempts + 1
        END,
        account_locked_until = CASE
        WHEN $1 = true THEN NULL
        WHEN failed_login_attempts + 1 >= 3 AND account_locked_until < CURRENT_TIMESTAMP THEN NULL
        WHEN failed_login_attempts + 1 >= 3 THEN NOW() + INTERVAL '5 minutes'
        ELSE NULL
        END,
        last_login_at = CASE
        WHEN $1 = true THEN CURRENT_TIMESTAMP
        ELSE last_login_at
        END
        WHERE email = $2
      `,
      [valid, email],
    );
    if (!valid) return next(new AppError(400, "WRONG_CREDENTIALS"));
    generateJWTToken(res, { id: userData?.id });
    res.status(200).json({
      status: "success",
    });

    // const isValid = await bcrypt.compare(password,user);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
}

export const logout = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.cookie("token", "");
  res.clearCookie("token");
  res.status(200).json({
    status: "success",
  });
});
