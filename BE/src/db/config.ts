import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const db = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  idleTimeoutMillis: undefined,
});

// db.connect();
db.on("connect", () => {
  console.log(`✅ connected to DB successfully`);
});
db.on("error", () => {
  console.log(`DB ERROR`);
});

export default db;
