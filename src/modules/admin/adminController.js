import { appointmentModel } from "../../../Database/models/Appointment.model.js";
import { doctorModel } from "../../../Database/models/Doctor.model.js";
import { reviewModel } from "../../../Database/models/Review.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { APIFeatures } from "../../utils/APIFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

// Add Doctor or Patient or Admin
const addAdmin = handler.addOne(userModel, "Admin", "admin");
const getAllAdmins = handler.getAll(userModel, "Admins", "admin");
const getAdmin = handler.getOne(userModel, "Admin");
const updateAdminProfile = handler.updateProfile(userModel, "Admin");
const changePassword = handler.changePassword(userModel, "Admin");
const changeAdminPassword = handler.changeUserPasword(userModel, "Admin");
const logout = handler.logout(userModel, "Admin");
const getAdminProfile = handler.getUserProfile(userModel, "Admin");

const addDoctor = handler.addOne(doctorModel, "Doctor", "doctor");
const getAllDoctors = handler.getAll(doctorModel, "Doctors", "doctor");
const getDoctor = handler.getOne(doctorModel, "Doctor");
const changeDoctorPassword = handler.changeUserPasword(doctorModel, "Doctor");
const deleteDoctor = handler.deleteUser(doctorModel, "Doctor");

const addUser = handler.addOne(userModel, "User", "user");
const deleteUser = handler.deleteUser(userModel, "User");
const getAllUsers = handler.getAll(userModel, "Users", "user");
const getUser = handler.getOne(userModel, "User");
const changeUserPassword = handler.changeUserPasword(userModel, "User");
const checkEmail = handler.checkEmail("User");

// Reviews
const deleteReview = catchError(async (req, res, next) => {
  const review = await reviewModel.findByIdAndDelete({
    _id: req.params.id,
  });

  if (review) {
    res.status(200).json({
      message: `Review Deleted Successfully`,
    });
  } else {
    next(new AppError(`Review Not Found`, 404));
  }
});
const getAllAppointments = catchError(async (req, res, next) => {
  // Find all appointments for the doctor
  let apiFeatures = new APIFeatures(
    appointmentModel.find(),
    req.query
  ).pagination();

  const appointments = await apiFeatures.mongooseQuery.populate(
    "doctor",
    "name -_id"
  );

  let response = {};
  response["Appointments"] = appointments;

  if (appointments.length > 0) {
    const formattedAppointments = appointments.map((appointment) => {
      const { _id, doctor, description, patient, appointmentSchedule, status } =
        appointment;
      return {
        _id,
        doctor,
        description,
        patient,
        appointmentSchedule,
        status,
      };
    });

    res.status(200).json({
      message: "Success",
      page: apiFeatures.page,
      response: { Appointments: formattedAppointments },
    });
  } else {
    return next(new AppError("Appointments empty", 400));
  }
});

const changeRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await userModel.updateOne(
    { _id: id, role: { $ne: "admin" } },
    { role },
    { new: true }
  );
  if (!user.modifiedCount) {
    return next(
      new AppError(`User is not found or role can't be changed !`, 400)
    );
  }
  return res
    .status(200)
    .json({ message: "Role has been updated successfully !" });
};

export {
  addUser,
  getAllUsers,
  deleteUser,
  getUser,
  deleteDoctor,
  getAdmin,
  addAdmin,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  addDoctor,
  getDoctor,
  getAllDoctors,
  changeDoctorPassword,
  changeUserPassword,
  changePassword,
  logout,
  getAdminProfile,
  deleteReview,
  getAllAppointments,
  changeRole,
  checkEmail,
};
