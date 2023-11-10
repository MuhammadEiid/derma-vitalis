import { appointmentModel } from "../../../Database/models/Appointment.model.js";
import { doctorModel } from "../../../Database/models/Doctor.model.js";
import { APIFeatures } from "../../utils/APIFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

const getDoctorProfile = handler.getUserProfile(doctorModel, "Doctor");
const updateDoctor = handler.updateProfile(doctorModel, "Doctor");
const changePassword = handler.changePassword(doctorModel, "Doctor");
const logout = handler.logout(doctorModel, "Doctor");

// Add available time slot for a doctor
const addAvailableSlot = catchError(async (req, res, next) => {
  const { day, startTime, endTime } = req.body;
  const formattedDay = new Date(day);

  // Check if the slot already exists
  // Check if the slot already exists in doctor's availableSchedule
  const existingSlotInDoctor = await doctorModel.findOne({
    _id: req.user._id,
    availableSchedule: {
      $elemMatch: { day, startTime, endTime },
    },
  });

  // Check if the slot already exists in appointments
  const appointmentExist = await appointmentModel.findOne({
    doctor: req.user._id,
    "appointmentSchedule.day": formattedDay.toISOString().split("T")[0],
    "appointmentSchedule.startTime": startTime,
    "appointmentSchedule.endTime": endTime,
  });

  if (existingSlotInDoctor || appointmentExist) {
    return next(new AppError("The time slot already exists", 400));
  }

  let doctor = await doctorModel.findByIdAndUpdate(
    req.user._id,
    { $push: { availableSchedule: req.body } },
    { new: true }
  );

  if (!doctor) {
    return next(new AppError("Something went wrong..", 400));
  }

  const newSlot = doctor.availableSchedule[doctor.availableSchedule.length - 1];

  return res.json(newSlot);
});

const getDoctorAppointments = catchError(async (req, res, next) => {
  // Check if the doctor exists
  const doctor = await doctorModel.findById(req.user._id);
  if (!doctor) {
    return next(new AppError("Something went wrong!", 404));
  }

  // Find all appointments for the doctor
  let apiFeatures = new APIFeatures(
    appointmentModel.find({ doctor: req.user._id, status: "Approved" }),
    req.query
  ).pagination();

  const appointments = await apiFeatures.mongooseQuery;

  if (appointments.length > 0) {
    const formattedAppointments = appointments.map((appointment) => {
      const { description, patient, appointmentSchedule, status } = appointment;
      return {
        patient,
        appointmentSchedule,
        description,
        status,
      };
    });

    res.status(200).json({
      page: apiFeatures.page,
      appointments: formattedAppointments,
    });
  } else {
    return next(new AppError("Appointments empty", 400));
  }
});

const workingHours = catchError(async (req, res, next) => {
  const { day, startTime, endTime } = req.body;

  if (!day || !startTime || !endTime) {
    return next(new AppError("Please provide all required fields.", 400));
  }

  const existingSlotInDoctor = await doctorModel.findOne({
    _id: req.user._id,
    workingHours: {
      $elemMatch: { day, startTime, endTime },
    },
  });

  if (existingSlotInDoctor) {
    return next(new AppError("The time slot already exists", 400));
  }

  const updatedDoctor = await doctorModel.findByIdAndUpdate(
    req.user._id,
    { $push: { workingHours: { day, startTime, endTime } } },
    { new: true }
  );

  if (!updatedDoctor) {
    return next(new AppError("Something went wrong..", 400));
  }

  res.status(200).json({
    message: "Working Hours Added Successfully",
    doctor: updatedDoctor,
  });
});

export {
  updateDoctor,
  workingHours,
  getDoctorProfile,
  changePassword,
  logout,
  addAvailableSlot,
  getDoctorAppointments,
};
