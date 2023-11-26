import { blogModel } from "../../../Database/models/Blog.model.js";
import { doctorModel } from "../../../Database/models/Doctor.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./blogValidation.js";

// Add blog
const addBlog = catchError(async (req, res, next) => {
  const { error } = addContentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  if (!req.body.title) {
    return next(new AppError("Title is required", 400));
  }
  if (!req.body.description) {
    return next(new AppError("Description is required", 400));
  }
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }
  req.body.imageCover = req.file.filename;

  const blog = new blogModel({
    ...req.body,
    doctor: req.user._id,
  });

  await blog.save();

  // Add the Blog to the doctor's Blogs array
  await doctorModel.findByIdAndUpdate(
    req.user._id,
    { $push: { blogs: blog._id } },
    { new: true }
  );
  res.status(200).json({
    message: `Blog Added Successfully`,
    blog,
  });
});

const getAllBlogs = handler.getAll(blogModel, "Blogs");

const updateBlog = catchError(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  const updatedBlog = await blogModel.findOneAndUpdate(
    { _id: id, doctor: req.user._id },
    req.body,
    { new: true }
  );

  if (updatedBlog) {
    res.status(200).json({
      message: `Blog Updated Successfully`,
      updatedBlog,
    });
  } else {
    next(new AppError(`Blog Not Found`, 404));
  }
});

const deleteBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  const blog = await blogModel.findByIdAndDelete({
    _id: id,
    doctor: req.user._id,
  });

  if (blog) {
    // Remove the Blog from the user's Blogs array
    await doctorModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { blogs: blog._id } },
      { new: true }
    );

    res.status(200).json({
      message: `Blog is Deleted Successfully`,
    });
  } else {
    next(new AppError(`Blog Not Found`, 404));
  }
});

const getBlog = handler.getOne(blogModel, "Blog");

export { addBlog, getAllBlogs, updateBlog, deleteBlog, getBlog };
