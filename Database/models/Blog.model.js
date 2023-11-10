import mongoose, { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      en: {
        type: String,
        trim: true,
        min: 3,
      },
      ar: {
        type: String,
        trim: true,
        min: 3,
      },
    },

    description: {
      en: {
        type: String,
        trim: true,
        min: 3,
      },
      ar: {
        type: String,
        trim: true,
        min: 3,
      },
    },

    doctor: {
      type: Schema.ObjectId,
      ref: "doctor",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageCover: String,
  },
  { timestamps: true }
);

blogSchema.post("init", function () {
  if (this.imageCover)
    this.imageCover = process.env.BaseURL + "blogs/" + this.imageCover;
});

blogSchema.pre(/^find/, function () {
  this.populate({
    path: "doctor",
    select: "name email -_id",
  });
});

export const blogModel = mongoose.models.blog || model("blog", blogSchema);
