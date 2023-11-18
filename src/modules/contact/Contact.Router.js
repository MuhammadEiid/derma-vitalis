import express from "express";
import * as contact from "./Contact.Controller.js";
import { validate } from "../../middleware/validate.js";
import { contactSchema } from "./contactValidation.js";

const contactRouter = express.Router();

contactRouter
  .route("/")
  .post(validate(contactSchema), contact.sendEmail)
  .get(contact.getAllEmails);

export default contactRouter;
