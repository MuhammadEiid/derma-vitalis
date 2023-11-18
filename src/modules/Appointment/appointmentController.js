import { appointmentModel } from "../../../Database/models/Appointment.model.js";
import { doctorModel } from "../../../Database/models/Doctor.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

const getDoctorAvailableSlots = catchError(async (req, res, next) => {
  const { doctorId } = req.params;
  const { day } = req.query;

  const doctor = await doctorModel.findById(doctorId);
  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }

  const availableSlots = doctor.availableSchedule.filter(
    (slot) => slot.day.toISOString().split("T")[0] === day
  );

  if (availableSlots.length <= 0) {
    return next(new AppError("No available schedule for this doctor", 400));
  }
  res.json(availableSlots);
});

const makeAppointment = catchError(async (req, res, next) => {
  const { day, startTime, endTime, description } = req.body;
  const { doctorId } = req.params;

  const [doctor, existingAppointment] = await Promise.all([
    doctorModel.findById(doctorId),
    appointmentModel.findOne({
      patient: req.user._id,
      "appointmentSchedule.day": day,
      "appointmentSchedule.startTime": startTime,
      "appointmentSchedule.endTime": endTime,
    }),
  ]);

  if (!doctor) {
    return next(noDoctorError);
  }

  const availableSlot = doctor.availableSchedule.find(
    (slot) =>
      slot.day.toISOString().split("T")[0] === day &&
      slot.startTime === startTime &&
      slot.endTime === endTime
  );

  if (!availableSlot) {
    return next(slotNotAvailableError);
  }

  if (existingAppointment) {
    if (existingAppointment.status === "Cancelled") {
      return next(cancelledAppointmentError);
    } else if (existingAppointment.status === "Completed") {
      return res.status(200).json({ message: "Appointment is completed" });
    }
    return next(appointmentExistsError);
  }

  const appointment = await appointmentModel.create({
    patient: req.user._id,
    doctor: doctorId,
    appointmentSchedule: [{ day, startTime, endTime }],
    description,
  });

  appointment.status = "Approved";

  const appointmentScheduleIndex = doctor.availableSchedule.findIndex(
    (schedule) =>
      schedule.day.toISOString().split("T")[0] === day &&
      schedule.startTime === startTime &&
      schedule.endTime === endTime
  );

  doctor.availableSchedule.splice(appointmentScheduleIndex, 1);
  doctor.appointments.push({
    _id: appointment._id,
    status: appointment.status,
  });

  const patient = await userModel.findOne({ _id: req.user._id });

  if (!patient) {
    return next(patientNotFoundError);
  }

  patient.appointments.push({
    _id: appointment._id,
    status: appointment.status,
  });

  await Promise.all([doctor.save(), appointment.save(), patient.save()]);

  res.status(200).json({ message: successMessage });
});

// ---------------------------------------------------------------------- //

const cancelAppointment = catchError(async (req, res, next) => {
  const { appointmentId } = req.params;

  // Find the appointment
  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  if (appointment.status === "Cancelled") {
    return res.status(200).json({ message: "Appointment Already Cancelled" });
  }
  // Update the appointment status to "Cancelled"
  appointment.status = "Cancelled";
  await appointment.save();

  // Remove the appointment from doctorAppointments
  const doctor = await doctorModel.findById(appointment.doctor);
  if (doctor) {
    // Find the specific schedule for the appointment
    const appointmentScheduleIndex = doctor.availableSchedule.findIndex(
      (schedule) =>
        schedule.day.toISOString().split("T")[0] ===
          appointment.appointmentSchedule.day &&
        schedule.startTime === appointment.appointmentSchedule.startTime &&
        schedule.endTime === appointment.appointmentSchedule.endTime
    );

    // Remove the schedule from the availableSchedule array
    doctor.availableSchedule.splice(appointmentScheduleIndex, 1);

    // Add the appointment to doctor's appointment history with "Cancelled" status
    doctor.appointments.push({
      _id: appointment._id,
      status: appointment.status,
    });
  }
  await doctor.save();

  const patient = await userModel.findById({ _id: appointment.patient });

  if (!patient) {
    return next(new AppError("Patient not found", 404));
  }

  // update the appointment status inside the user document

  const appointmentIndex = patient.appointments.findIndex(
    (appt) => appt._id.toString() === appointmentId.toString()
  );

  if (appointmentIndex !== -1) {
    patient.appointments[appointmentIndex].status = appointment.status;
    await patient.save();
  }

  return res.status(200).json({ message: "Appointment Cancelled" });
});

// ---------------------------------------------------------------------- //

const completeAppointment = catchError(async (req, res, next) => {
  const { appointmentId } = req.params;

  // Find the appointment
  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  if (appointment.status === "Completed") {
    return res.status(200).json({ message: "Appointment Already Completed" });
  }

  // Update the appointment status to "Completed"
  appointment.status = "Completed";
  await appointment.save();

  const doctor = await doctorModel.findById(appointment.doctor);
  if (doctor) {
    const appointmentScheduleIndex = doctor.availableSchedule.findIndex(
      (schedule) =>
        schedule.day.toISOString().split("T")[0] ===
          appointment.appointmentSchedule.day &&
        schedule.startTime === appointment.appointmentSchedule.startTime &&
        schedule.endTime === appointment.appointmentSchedule.endTime
    );

    // Remove the schedule from the availableSchedule array
    doctor.availableSchedule.splice(appointmentScheduleIndex, 1);

    // Add the appointment to doctor's appointment history with "Completed" status
    doctor.appointments.push({
      _id: appointment._id,
      status: appointment.status,
    });

    // Add the appointment to doctor's appointment history with "Completed" status
    const appointmentIndex = doctor.appointments.findIndex(
      (appt) => appt._id.toString() === appointmentId.toString()
    );

    if (appointmentIndex !== -1) {
      doctor.appointments[appointmentIndex].status = appointment.status;
      await doctor.save();
    }
  }

  const patient = await userModel.findById({ _id: appointment.patient });

  if (!patient) {
    return next(new AppError("Patient not found", 404));
  }

  const appointmentIndex = patient.appointments.findIndex(
    (appt) => appt._id.toString() === appointmentId.toString()
  );

  if (appointmentIndex !== -1) {
    patient.appointments[appointmentIndex].status = appointment.status;
    await patient.save();
  }

  return res.status(200).json({ message: "Appointment Completed" });
});

// Common error messages

const noDoctorError = new AppError(
  "No available schedule for this doctor",
  400
);
const slotNotAvailableError = new AppError(
  "The selected slot is not available",
  400
);
const appointmentExistsError = new AppError(
  "You already have an appointment at this time",
  400
);

const cancelledAppointmentError = new AppError(
  "Unfortunately the appointment is cancelled ",
  400
);

const patientNotFoundError = new AppError("Patient not found", 404);
const successMessage = "Your appointment has been successfully scheduled";

export {
  makeAppointment,
  getDoctorAvailableSlots,
  cancelAppointment,
  completeAppointment,
};
