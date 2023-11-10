import Joi from "joi";

const idValidation = Joi.string().hex().length(24).required();
const pwalidation = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
  .required()
  .min(5)
  .max(30);

const addUser = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  gender: Joi.string().valid("male", "female").required(),
  bloodType: Joi.string()
    .valid("A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-")
    .required(),

  phone: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  medicalHistory: Joi.string().min(3).max(250).required(),
  password: pwalidation,
});

const changePasswordValidation = Joi.object({
  oldPassword: pwalidation,
  repeat_password: Joi.ref("newPassword"),
  newPassword: pwalidation,
  id: idValidation,
}).with("newPassword", "repeat_password");

export { changePasswordValidation, addUser };
