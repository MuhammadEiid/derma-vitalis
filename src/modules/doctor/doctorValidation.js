import Joi from "joi";

const idValidation = Joi.string().hex().length(24).required();

const passwordValidationPattern = /^[a-zA-Z0-9]{5,30}$/;

const pwalidation = Joi.string()
  .pattern(passwordValidationPattern)
  .required()
  .min(5)
  .max(30);

const checkID = Joi.object({
  id: idValidation,
});

const changePasswordValidation = Joi.object({
  oldPassword: pwalidation,
  newPassword: pwalidation,
  repeat_password: Joi.ref("newPassword"),
  id: idValidation,
}).with("newPassword", "repeat_password");

const timeFormatRegex = /^([0-9]|0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

const availableScheduleSchema = Joi.object({
  day: Joi.date().iso().required(),
  startTime: Joi.string().regex(timeFormatRegex).required(),
  endTime: Joi.string().regex(timeFormatRegex).required(),
});

const workingHoursSchema = Joi.object({
  day: Joi.string().valid(
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ),
  startTime: Joi.string().regex(timeFormatRegex).required(),
  endTime: Joi.string().regex(timeFormatRegex).required(),
});

export {
  changePasswordValidation,
  checkID,
  availableScheduleSchema,
  workingHoursSchema,
};
