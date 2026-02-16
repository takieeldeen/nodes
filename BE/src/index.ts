import dotenv from "dotenv";
import app from "./app";
// import mongoose from "mongoose";

dotenv.config();

const CONNECTION_STRING = process.env.DB_STRING?.replace(
  "<<USERNAME>>",
  process?.env?.DB_USERNAME ?? "",
)?.replace("<<PASSWORD>>", process?.env?.DB_PASSWORD ?? "");

// mongoose
//   .connect(CONNECTION_STRING!)
//   .then(() => {
//     console.log("✅ Connected to the database");
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     // Avoid crashing the app — optionally retry or alert
//   });

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("✅ Listening on Port", port);
});
