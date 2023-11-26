import express from "express";
import * as appointment from "./appointmentController.js";
import { protectedRoutes } from "../Authentication/authController.js";
import { validate } from "../../middleware/validate.js";
import {
  getAvailableSlotSchema,
  makeAppointmentSchema,
  modifyAppointmentSchema,
} from "./appointmentValidation.js";

const appointmentRouter = express.Router();

appointmentRouter
  .route("/availableSlots/:doctorId")
  .post(
    protectedRoutes,
    validate(getAvailableSlotSchema),
    appointment.getDoctorAvailableSlots
  );

appointmentRouter
  .route("/makeAppointment/:doctorId")
  .post(
    protectedRoutes,
    validate(makeAppointmentSchema),
    appointment.makeAppointment
  );

appointmentRouter
  .route("/cancel/:appointmentId")
  .post(
    validate(modifyAppointmentSchema),
    protectedRoutes,
    appointment.cancelAppointment
  );

appointmentRouter
  .route("/complete/:appointmentId")
  .post(
    validate(modifyAppointmentSchema),
    protectedRoutes,
    appointment.completeAppointment
  );

export default appointmentRouter;
