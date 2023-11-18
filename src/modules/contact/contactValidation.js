import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  message: Joi.string().required().min(5).max(350),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
});

export { contactSchema };
