import express from "express";
import * as doctor from "./doctorController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { validate } from "../../middleware/validate.js";
import { changePasswordValidation } from "../user/userValidation.js";
import {
  availableScheduleSchema,
  workingHoursSchema,
} from "./doctorValidation.js";

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
  validate(changePasswordValidation),
  protectedRoutes,
  allowedTo("doctor"),
  doctor.changePassword
);
doctorRouter.put(
  "/availableSlots",
  validate(availableScheduleSchema),
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
  validate(workingHoursSchema),
  protectedRoutes,
  allowedTo("doctor"),
  doctor.workingHours
);

export default doctorRouter;
