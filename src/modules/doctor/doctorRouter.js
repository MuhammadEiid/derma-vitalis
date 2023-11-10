import express from "express";
import * as doctor from "./doctorController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { validate } from "../../middleware/validate.js";
import { changePasswordValidation } from "../user/userValidation.js";

const doctorRouter = express.Router();

doctorRouter
  .route("/")
  .put(
    protectedRoutes,
    allowedTo("doctor"),
    uploadSingleFile("profilePic", "doctors"),
    doctor.updateDoctor
  )
  .get(protectedRoutes, allowedTo("doctor"), doctor.getDoctorProfile);

doctorRouter.put(
  "/changePassword",
  protectedRoutes,
  allowedTo("doctor"),
  validate(changePasswordValidation),
  doctor.changePassword
);
doctorRouter.put(
  "/availableSlots",
  protectedRoutes,
  allowedTo("doctor"),
  doctor.addAvailableSlot
);

doctorRouter
  .route("/appointments")
  .get(protectedRoutes, doctor.getDoctorAppointments);

doctorRouter.patch("/logout", protectedRoutes, doctor.logout);

doctorRouter.put(
  "/workingHours",
  protectedRoutes,
  allowedTo("doctor"),
  doctor.workingHours
);

export default doctorRouter;
