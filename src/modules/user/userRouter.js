import express from "express";
import * as user from "./userController.js";
import { validate } from "../../middleware/validate.js";
import { changePasswordValidation, checkID } from "./userValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .put(
    protectedRoutes,
    allowedTo("user"),
    uploadSingleFile("profilePic", "patients"),
    user.updatePatient
  )
  .get(protectedRoutes, allowedTo("user"), user.getUserProfile);

userRouter.put(
  "/changePassword",
  protectedRoutes,
  validate(changePasswordValidation),
  allowedTo("user"),
  user.changePassword
);
userRouter.put(
  "/toggleLike/:id",
  validate(checkID),
  protectedRoutes,
  allowedTo("user"),
  user.toggleLikeDislikeBlog
);
userRouter.put(
  "/toggleSave/:id",
  validate(checkID),
  protectedRoutes,
  allowedTo("user"),
  user.toggleSaveUnsaveBlog
);

userRouter.patch("/logout", protectedRoutes, user.logout);

export default userRouter;
