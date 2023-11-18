import express from "express";
import * as blog from "./Blog.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";

const blogRouter = express.Router();

blogRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("doctor"),
    uploadSingleFile("imageCover", "blogs"),
    blog.addBlog
  )
  .get(blog.getAllBlogs);

blogRouter
  .route("/:id")
  .put(
    validate(checkID),
    protectedRoutes,
    allowedTo("doctor"),
    uploadSingleFile("imageCover", "blogs"),
    blog.updateBlog
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("doctor", "admin"),
    blog.deleteBlog
  )
  .get(validate(checkID), blog.getBlog);

export default blogRouter;
