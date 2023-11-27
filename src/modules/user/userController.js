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

  const updateOperation = req.user.likedBlogs.includes(id)
    ? { $pull: { likedBlogs: id } }
    : { $addToSet: { likedBlogs: id } };

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    updateOperation,
    { new: true }
  );

  const message = req.user.likedBlogs.includes(id)
    ? "Blog disliked successfully"
    : "Blog liked successfully";

  res.status(200).json({ message });
});

const toggleSaveUnsaveBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  const updateOperation = req.user.savedBlogs.includes(id)
    ? { $pull: { savedBlogs: id } }
    : { $addToSet: { savedBlogs: id } };

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    updateOperation,
    { new: true }
  );

  const message = req.user.savedBlogs.includes(id)
    ? "Blog unsaved successfully"
    : "Blog saved successfully";

  res.status(200).json({ message });
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
