import express from "express";
import * as appointment from "./appointmentController.js";
import { protectedRoutes } from "../Authentication/authController.js";

const appointmentRouter = express.Router();

appointmentRouter
  .route("/availableSlots/:doctorId")
  .post(protectedRoutes, appointment.getDoctorAvailableSlots);

appointmentRouter
  .route("/makeAppointment/:doctorId")
  .post(protectedRoutes, appointment.makeAppointment);

appointmentRouter
  .route("/cancel/:appointmentId")
  .post(protectedRoutes, appointment.cancelAppointment);

appointmentRouter
  .route("/complete/:appointmentId")
  .post(protectedRoutes, appointment.completeAppointment);

export default appointmentRouter;
