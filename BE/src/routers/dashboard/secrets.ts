import { Router } from "express";
import {
  createSecret,
  deleteSecret,
  getUserSecrets,
} from "../../controllers/secrets";
import { checkAuth } from "../../utilis/auth";

const SecretsRouter = Router();

SecretsRouter.use(checkAuth);
SecretsRouter.route("/").post(createSecret).get(getUserSecrets);
SecretsRouter.route("/:secretId").delete(deleteSecret);

export default SecretsRouter;
