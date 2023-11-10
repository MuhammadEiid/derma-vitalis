import Joi from "joi";

const idValidation = Joi.string().hex().length(24).required();

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  gender: Joi.string().valid("male", "female").required(),
  phone: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string()
    .min(5)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
    .required(),
  repeat_password: Joi.string().valid(Joi.ref("password")).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(5)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
    .required(),
});

export { registerSchema, loginSchema };
