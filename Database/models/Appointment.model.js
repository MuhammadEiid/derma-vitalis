import mongoose, { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },

    appointmentSchedule: [
      {
        day: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],

    description: {
      en: { type: String },
      ar: { type: String },
    },

    status: {
      type: String,
      enum: ["Cancelled", "Approved", "Completed"],
      reason: String,
    },
  },
  { timestamps: true }
);

appointmentSchema.pre(/^find/, function () {
  this.populate("patient", "name -_id");
});
export const appointmentModel =
  mongoose.models.appointment || model("appointment", appointmentSchema);
