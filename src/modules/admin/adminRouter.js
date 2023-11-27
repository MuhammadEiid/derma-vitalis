import express from "express";
import * as admin from "./adminController.js";
import { validate } from "../../middleware/validate.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { changePasswordValidation } from "../user/userValidation.js";
import {
  addUser,
  changePasswordToOthers,
  changeRole,
  checkID,
} from "./adminValidation.js";

const adminRouter = express.Router();
// Add (Admin, Doctor, Patient)
adminRouter.post(
  "/addAdmin",
  protectedRoutes,
  validate(addUser),
  allowedTo("admin"),
  uploadSingleFile("profilePic", "admins"),
  admin.addAdmin
);

adminRouter.post(
  "/addDoctor",
  protectedRoutes,
  validate(addUser),
  allowedTo("admin"),
  uploadSingleFile("profilePic", "doctors"),
  admin.addDoctor
);

adminRouter.post(
  "/addUser",
  protectedRoutes,
  validate(addUser),
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
  validate(checkID),
  protectedRoutes,
  admin.getUser
);
adminRouter.get("/checkEmail", admin.checkEmail);

adminRouter.get(
  "/profile",
  protectedRoutes,
  allowedTo("admin"),
  admin.getAdminProfile
);

adminRouter.get(
  "/getAdmin/:id",
  validate(checkID),
  protectedRoutes,
  allowedTo("admin"),
  admin.getAdmin
);

adminRouter.get("/getDoctor/:id", validate(checkID), admin.getDoctor);

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
  validate(checkID),
  allowedTo("admin"),
  admin.deleteUser
);

// Delete Admin
adminRouter.delete(
  "/deleteAdmin/:id",
  protectedRoutes,
  validate(checkID),
  allowedTo("admin"),
  admin.deleteUser
);

// Delete Review
adminRouter.delete(
  "/review/:id",
  protectedRoutes,
  validate(checkID),
  allowedTo("admin"),
  admin.deleteReview
);

// Delete Doctor
adminRouter.delete(
  "/deleteDoctor/:id",
  protectedRoutes,
  validate(checkID),
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

// Change user role to admin
adminRouter.put(
  "/changeRole/:id",
  protectedRoutes,
  validate(changeRole),
  allowedTo("admin"),
  admin.changeRole
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
  validate(changePasswordToOthers),
  allowedTo("admin"),
  admin.changeAdminPassword
);

adminRouter.patch(
  "/changeDoctorPassword/:id",
  protectedRoutes,
  validate(changePasswordToOthers),
  allowedTo("admin"),
  admin.changeDoctorPassword
);

adminRouter.patch(
  "/changeUserPassword/:id",
  protectedRoutes,
  validate(changePasswordToOthers),
  allowedTo("admin"),
  admin.changeUserPassword
);

adminRouter.patch("/logout", protectedRoutes, admin.logout);

export default adminRouter;
