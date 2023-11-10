import express from "express";
import * as blog from "./Blog.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";

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
    protectedRoutes,
    allowedTo("doctor"),
    uploadSingleFile("imageCover", "blogs"),
    blog.updateBlog
  )
  .delete(protectedRoutes, allowedTo("doctor", "admin"), blog.deleteBlog)
  .get(blog.getBlog);

export default blogRouter;
