import db from "../db/config";
import { catchAsync } from "../utilis/catchAsync";
import { AppError } from "./error";

export const createSecret = catchAsync(async (req, res, next) => {
  const { name, value, env } = req.body;
  const user_id = req.user?.id;
  console.log(user_id);
  if (!name) return next(new AppError(400, "NAME_REQUIRED"));
  if (!value) return next(new AppError(400, "VALUE_REQUIRED"));

  await db.query(
    `INSERT INTO tasks.secrets (name,value,user_id,env) VALUES($1,$2,$3,$4)`,
    [name, value, user_id, env ?? "DEFAULT"],
  );
  res.status(201).json({
    status: "success",
  });
});

export const getUserSecrets = catchAsync(async (req, res, next) => {
  console.log("get triggered");
  const { page, size } = req.query ?? { page: 1, size: 9 };
  const user_id = req?.user?.id;
  const skippedRows = (+(page ?? 1) - 1) * +(size ?? 9);
  const query = await db.query(
    `SELECT * FROM tasks.secrets WHERE user_id = $1 ORDER BY id DESC OFFSET $2 LIMIT $3 `,
    [user_id, `${skippedRows}`, size ?? 9],
  );

  const { rows } = await db.query(
    `SELECT COUNT(id) FROM tasks.secrets WHERE user_id = $1`,
    [user_id],
  );

  res.status(201).json({
    status: "success",
    content: query?.rows,
    results: rows?.[0]?.count,
  });
});

export const deleteSecret = catchAsync(async (req, res, next) => {
  const { secretId } = req.params;
  if (!secretId) return next(new AppError(400, "SECRET_ID_REQUIRED"));
  const user_id = req?.user?.id;
  await db.query(`DELETE FROM tasks.secrets WHERE id = $1 AND user_id = $2`, [
    secretId,
    user_id,
  ]);
  res.status(204).json({
    status: "success",
  });
});
