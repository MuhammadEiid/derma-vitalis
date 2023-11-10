import express from "express";
import * as user from "./authController.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "./authValidation.js";
const authRouter = express.Router();

authRouter.route("/signup").post(user.signup);
authRouter.route("/login").post(validate(loginSchema), user.login);

authRouter.route("/confirmEmail/:token").get(user.activateAccount);
authRouter.route("/newConfirmEmail/:token").get(user.newConfirmEmail);

export default authRouter;
