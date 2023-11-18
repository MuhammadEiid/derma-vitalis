import Joi from "joi";

const idValidation = Joi.string().hex().length(24).required();
const descriptionSchema = Joi.object({
  en: Joi.string(),
  ar: Joi.string(),
}).or("en", "ar");

const getAvailableSlotSchema = Joi.object({
  doctorId: idValidation,
  day: Joi.date().iso().required(),
});

const timeFormatRegex = /^([0-9]|0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

const makeAppointmentSchema = Joi.object({
  day: Joi.date().iso().required(),
  startTime: Joi.string().regex(timeFormatRegex).required(),
  endTime: Joi.string().regex(timeFormatRegex).required(),
  description: descriptionSchema,
  doctorId: idValidation,
});
const modifyAppointmentSchema = Joi.object({
  appointmentId: idValidation,
});

export {
  getAvailableSlotSchema,
  makeAppointmentSchema,
  modifyAppointmentSchema,
};
