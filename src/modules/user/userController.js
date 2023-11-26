import { userModel } from "../../../Database/models/User.model.js";
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
export {
  toggleLikeDislikeBlog,
  toggleSaveUnsaveBlog,
  changePassword,
  logout,
  updatePatient,
  getUserProfile,
};
