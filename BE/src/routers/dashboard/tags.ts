import { Router } from "express";
import { createTag, getMyTags } from "../../controllers/tags";
import { checkAuth } from "../../utilis/auth";

const tagsRouter = Router();

tagsRouter.use(checkAuth);
tagsRouter.route("/").get(getMyTags).post(createTag);

export default tagsRouter;
