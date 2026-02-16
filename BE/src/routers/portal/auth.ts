import { Router } from "express";
import {
  login,
  logout,
  resendToken,
  signup,
  verifyEmail,
} from "../../controllers/auth";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/resend-token", resendToken);
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
