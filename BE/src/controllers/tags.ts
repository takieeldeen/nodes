import db from "../db/config";
import { catchAsync } from "../utilis/catchAsync";

export const getMyTags = catchAsync(async (req, res, next) => {
  const user_id = req.user?.id;
  const { rows, rowCount } = await db.query(
    `SELECT id,name FROM tasks.tags WHERE user_id = $1`,
    [user_id],
  );
  res.status(200).json({
    status: "success",
    content: rows,
    results: rowCount,
  });
});

export const createTag = catchAsync(async (req, res, next) => {
  const user_id = req.user?.id;
  const { name } = req.body ?? {};
  await db.query(`INSERT INTO tasks.tags (name,user_id) VALUES($1,$2)`, [
    name,
    user_id,
  ]);
  res.status(201).json({ status: "success" });
});
