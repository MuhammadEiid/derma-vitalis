import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const doctorSchema = new Schema(
  {
    name: {
      en: {
        type: String,
        trim: true,
        min: 3,
        max: 30,
      },
      ar: {
        type: String,
        trim: true,
        min: 3,
        max: 30,
      },
    },

    password: { type: String, min: 5, max: 30, required: true },

    email: {
      type: String,
      trim: true,
      required: [true, "Please add a doctor email"],
      unique: true,
      lowercase: true,
    },

    phone: { type: String },

    gender: { type: String, required: true, enum: ["male", "female"] },

    isActive: { type: Boolean, default: "false" },

    verified: {
      type: Boolean,
      default: "true",
    },

    passwordChangedAt: Date,

    profilePic: String,

    // Doctor information

    specialization: {
      en: { type: String },
      ar: { type: String },
    },

    experience: [
      {
        en: {
          startYear: {
            type: String,
          },
          endYear: {
            type: String,
          },
          clinic: {
            type: String,
          },
          title: {
            type: String,
          },
        },
        ar: {
          startYear: {
            type: String,
          },
          endYear: {
            type: String,
          },
          clinic: {
            type: String,
          },
          title: {
            type: String,
          },
        },
      },
    ],

    education: [
      {
        en: {
          startYear: {
            type: String,
          },
          endYear: {
            type: String,
          },
          specialization: {
            type: String,
          },
          university: {
            type: String,
          },
        },
        ar: {
          startYear: {
            type: String,
          },
          endYear: {
            type: String,
          },
          specialization: {
            type: String,
          },
          university: {
            type: String,
          },
        },
      },
    ],

    bio: {
      en: { type: String, maxLength: 350 },
      ar: { type: String, maxLength: 350 },
    },

    availableSchedule: [
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

    workingHours: [
      {
        day: {
          type: String,
          enum: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednsday",
            "Thursday",
            "Friday",
          ],
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    blogs: [
      {
        type: Schema.ObjectId,
        ref: "blog",
      },
    ],

    passwordChangedAt: Date,

    appointments: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "appointment" },
        status: String,
      },
    ],
    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
    },
  },
  { timestamps: true }
);

doctorSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip hashing if password is not modified
  }

  // Hash doctor Password in adding doctor
  this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT));
  next();
});

doctorSchema.pre("findOneAndUpdate", function () {
  // Hash doctor Password in Update
  if (this._update.password)
    this._update.password = bcrypt.hashSync(
      this._update.password,
      parseInt(process.env.SALT)
    );
});

doctorSchema.post("init", function () {
  if (this.profilePic)
    this.profilePic = process.env.BaseURL + "doctors/" + this.profilePic;
});

export const doctorModel =
  mongoose.models.doctor || model("doctor", doctorSchema);
