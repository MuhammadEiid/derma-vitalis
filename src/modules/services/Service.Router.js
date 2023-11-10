import express from "express";
import * as service from "./Service.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";

const serviceRouter = express.Router();

serviceRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("imageCover", "services"),
    service.addService
  )
  .get(service.getAllServices);
serviceRouter
  .route("/:id")
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("imageCover", "services"),
    service.updateService
  )
  .delete(protectedRoutes, allowedTo("admin"), service.deleteService)
  .get(service.getService);

export default serviceRouter;
