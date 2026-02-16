import fs from "fs";
import db from "./config";

(async function () {
  const dirPath = `${__dirname}/schemas`;
  const filePathes = fs.readdirSync(dirPath, { encoding: "utf-8" });
  if (filePathes.length === 0) return;
  for (const path of filePathes) {
    const sql = fs.readFileSync(`${dirPath}/${path}`, { encoding: "utf-8" });
    await db.query(sql);
  }
  await db.end();
  return;
})()
  .then(() => {
    console.log("Migrated Data Successfully");
  })
  .catch((error) => {
    console.log(
      "Something went wrong while migrating the databases",
      error?.message
    );
  });
// migrate()
//   .then(() => {
//     console.log("Migrated Data Successfully");
//   })
//   .catch((error) => {
//     console.log(
//       "Something went wrong while migrating the databases",
//       error?.message
//     );
//   });
