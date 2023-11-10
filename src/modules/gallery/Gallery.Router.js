import express from "express";
import * as gallery from "./Gallery.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";

const galleryRouter = express.Router();

galleryRouter
  .route("/images")
  .post(
    protectedRoutes,
    uploadSingleFile("image", "gallery"),
    gallery.addImages
  );

galleryRouter
  .route("/videos")
  .post(
    protectedRoutes,
    uploadSingleFile("video", "gallery"),
    gallery.addVideos
  );

galleryRouter
  .route("/video/:videoId")
  .put(protectedRoutes, gallery.deleteVideo);

galleryRouter
  .route("/image/:imageId")
  .put(protectedRoutes, gallery.deleteImage);

galleryRouter.route("/images").delete(protectedRoutes, gallery.deleteAllImages);

galleryRouter.route("/videos").delete(protectedRoutes, gallery.deleteAllVideos);

galleryRouter.route("/").get(protectedRoutes, gallery.getAllGallery);

export default galleryRouter;
