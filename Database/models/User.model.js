import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    // Patient
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

    email: {
      type: String,
      trim: true,
      required: [true, "Please add a user email"],
      unique: true,
      lowercase: true,
    },
    password: { type: String, min: 5, max: 30, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    phone: { type: String },
    DOB: { type: Date },

    address: [
      {
        en: { city: String, street: String },
        ar: { city: String, street: String },
      },
    ],

    medicalHistory: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },

    profilePic: String,
    bloodType: {
      type: String,
      enum: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: Date,

    appointments: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "appointment" },
        status: String,
      },
    ],
    savedBlogs: [{ type: Schema.ObjectId, ref: "blog" }],
    likedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
    provider: {
      type: String,
      default: "System",
      enum: ["Google", "Facebook", "Apple", "System"],
      required: true,
    },
    contactForm: [
      {
        type: Schema.ObjectId,
        ref: "contact",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip hashing if password is not modified
  }
  // Hash doctor Password in adding doctor
  this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT));
  next();
});

userSchema.pre("findOneAndUpdate", function () {
  // Hash User Password in Update
  if (this._update.password)
    this._update.password = bcrypt.hashSync(
      this._update.password,
      parseInt(process.env.SALT)
    );
});

userSchema.post("init", function () {
  if (this.profilePic) {
    if (this.role === "admin") {
      this.profilePic = process.env.BaseURL + "admins/" + this.profilePic;
    } else {
      this.profilePic = process.env.BaseURL + "patients/" + this.profilePic;
    }
  }
});

userSchema.pre(/^find/, function () {
  this.populate("contactForm", "message -_id");
});

export const userModel = mongoose.models.user || model("user", userSchema);
