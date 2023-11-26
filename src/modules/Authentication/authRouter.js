import express from "express";
import * as user from "./authController.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema } from "./authValidation.js";
const authRouter = express.Router();

authRouter.route("/signup").post(user.signup);
authRouter.route("/login").post(validate(loginSchema), user.login);

authRouter.route("/confirmEmail/:token").get(user.activateAccount);
authRouter.route("/newConfirmEmail/:token").get(user.newConfirmEmail);

authRouter.post("/forget", user.forgetPassword);
authRouter.post("/reset/:token", user.resetPassword);

// Social Login
authRouter.get("/google", user.loginWithGmail);
authRouter.get("/google/callback", user.loginWithGmailCallback);

export default authRouter;
