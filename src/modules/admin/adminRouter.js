import express from "express";
import * as admin from "./adminController.js";
import { validate } from "../../middleware/validate.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { changePasswordValidation } from "../user/userValidation.js";

const adminRouter = express.Router();
// Add (Admin, Doctor, Patient)
adminRouter.post(
  "/addAdmin",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("profilePic", "admins"),
  admin.addAdmin
);

adminRouter.post(
  "/addDoctor",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("profilePic", "doctors"),
  admin.addDoctor
);

adminRouter.post(
  "/addUser",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("profilePic", "patients"),
  admin.addUser
);

// Get All (Admins, Doctors, Patients)
adminRouter.get(
  "/getAllUsers",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAllUsers
);
adminRouter.get(
  "/getAllDoctors",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAllDoctors
);
adminRouter.get(
  "/getAllAdmins",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAllAdmins
);

// Get Specific (Admin, Doctor, Patient)
adminRouter.get(
  "/getUser/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.getUser
);
adminRouter.get(
  "/profile",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAdminProfile
);

adminRouter.get(
  "/getAdmin/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAdmin
);

adminRouter.get(
  "/getDoctor/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.getDoctor
);

// Get all appointments
adminRouter.get(
  "/appointments",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAllAppointments
);

// Delete User
adminRouter.delete(
  "/deleteUser/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.deleteUser
);

// Delete Admin
adminRouter.delete(
  "/deleteAdmin/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.deleteUser
);

// Delete Review
adminRouter.delete(
  "/deleteReview/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.deleteReview
);

// Delete Doctor
adminRouter.delete(
  "/deleteDoctor/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.deleteDoctor
);

// Update Admin Profile
adminRouter.put(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("profilePic", "admins"),
  admin.updateAdminProfile
);

// Change password
adminRouter.put(
  "/changePassword",
  protectedRoutes,
  allowedTo("admin"),
  validate(changePasswordValidation),
  admin.changePassword
);

// Change Password for (Admin, Patient, Doctor)
adminRouter.patch(
  "/changeAdminPassword/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.changeAdminPassword
);

adminRouter.patch(
  "/changeDoctorPassword/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.changeDoctorPassword
);

adminRouter.patch(
  "/changeUserPassword/:id",
  protectedRoutes,
  allowedTo("admin"),
  admin.changeUserPassword
);

adminRouter.patch("/logout", protectedRoutes, admin.logout);

export default adminRouter;
