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

export { changePasswordValidation, checkID };
