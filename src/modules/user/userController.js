import { appointmentModel } from "../../../Database/models/Appointment.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { APIFeatures } from "../../utils/APIFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

const getUserProfile = handler.getUserProfile(userModel, "Patient");
const updatePatient = handler.updateProfile(userModel, "Patient");
const logout = handler.logout(userModel, "Patient");

const changePassword = handler.changePassword(userModel, "Patient");

const toggleLikeDislikeBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.likedBlogs.includes(id)) {
    // If the user has already liked the blog, remove the like
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { likedBlogs: id } },
      { new: true }
    );

    res.status(200).json({ message: "Blog disliked successfully" });
  } else {
    // If the user hasn't liked the blog, like it
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $push: { likedBlogs: id } },
      { new: true }
    );

    res.status(200).json({ message: "Blog liked successfully" });
  }
});

const toggleSaveUnsaveBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.savedBlogs.includes(id)) {
    // If the user has already saved the blog, unsave it
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedBlogs: id } },
      { new: true }
    );

    res.status(200).json({ message: "Blog unsaved successfully" });
  } else {
    // If the user hasn't saved the blog, save it
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $push: { savedBlogs: id } },
      { new: true }
    );

    res.status(200).json({ message: "Blog saved successfully" });
  }
});

const getSavedBlogs = handler.getUserSpecificItem(userModel, "savedBlogs");

const getLikedBlogs = handler.getUserSpecificItem(userModel, "likedBlogs");

const getUserAppointments = catchError(async (req, res, next) => {
  let apiFeatures = new APIFeatures(
    appointmentModel
      .find({ patient: req.user.id })
      .populate("doctor", "name -_id"),
    req.query
  ).pagination();

  const document = await apiFeatures.mongooseQuery;

  if (document.length > 0) {
    // Extract specific data from the response
    const responseData = document.map((appointment) => ({
      doctor: appointment.doctor,
      appointmentSchedule: appointment.appointmentSchedule,
    }));

    res.status(200).json({
      page: apiFeatures.page,
      response: responseData,
    });
  } else {
    next(new AppError(`No Appointments Found`, 404));
  }
});

export {
  toggleLikeDislikeBlog,
  toggleSaveUnsaveBlog,
  changePassword,
  logout,
  updatePatient,
  getUserProfile,
  getSavedBlogs,
  getLikedBlogs,
  getUserAppointments,
};
