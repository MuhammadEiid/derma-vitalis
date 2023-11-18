import { galleryModel } from "../../../Database/models/Gallery.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

// Add images
const addImages = catchError(async (req, res, next) => {
  // Assuming you're using multer to upload the image
  if (!req.file) {
    return next(new AppError("No image file provided", 400));
  }

  if (!req.body.en || !req.body.ar) {
    return next(
      new AppError("Both English and Arabic titles are required", 400)
    );
  }
  // Create a new image object
  const newImage = {
    image: req.file.filename, // The name of the uploaded image file
    alt: {
      en: req.body.en, // English title
      ar: req.body.ar, // Arabic title
    },
  };

  // Find the gallery document and push the new image to the "images" array
  let gallery = await galleryModel.findOne({});

  if (!gallery) {
    // Create a new gallery document
    gallery = new galleryModel({});
    await gallery.save();
  }

  const updatedGallery = await galleryModel.findOneAndUpdate(
    {},
    { $push: { images: newImage } },
    { new: true }
  );

  res.json(updatedGallery.images);
});

// Add Video
const addVideos = catchError(async (req, res, next) => {
  // Assuming you're using multer to upload the video
  if (!req.file) {
    return next(new AppError("No video file provided", 400));
  }

  if (!req.body.en || !req.body.ar) {
    return next(
      new AppError("Both English and Arabic titles are required", 400)
    );
  }
  // Create a new video object
  const newVideo = {
    video: req.file.filename, // The name of the uploaded video file
    alt: {
      en: req.body.en, // English title
      ar: req.body.ar, // Arabic title
    },
  };

  // Find the gallery document and push the new video to the "videos" array
  let gallery = await galleryModel.findOne({});

  if (!gallery) {
    // Create a new gallery document
    gallery = new galleryModel({});
    await gallery.save();
  }

  const updatedGallery = await galleryModel.findOneAndUpdate(
    {},
    { $push: { videos: newVideo } },
    { new: true }
  );

  res.json(updatedGallery.videos);
});

const getAllGallery = handler.getAll(galleryModel, "Gallery");

// Delete all images
const deleteAllImages = catchError(async (req, res, next) => {
  await galleryModel.findOneAndUpdate({}, { $set: { images: [] } });
  return res.status(200).json({ message: "Images has been cleared" });
});

// Delete all videos
const deleteAllVideos = catchError(async (req, res, next) => {
  await galleryModel.findOneAndUpdate({}, { $set: { videos: [] } });
  return res.status(200).json({ message: "Videos has been cleared" });
});

// Delete specific image
const deleteImage = catchError(async (req, res, next) => {
  const { id } = req.params;

  const gallery = await galleryModel.findOne({});

  if (!gallery) {
    return next(new AppError("Something went wrong!", 404));
  }

  const image = gallery.images.find((image) => image._id.toString() === id);

  if (!image) {
    return next(new AppError("Image not found", 404));
  }

  await galleryModel.findOneAndUpdate(
    {},
    { $pull: { images: { _id: id } } },
    { new: true }
  );

  return res.status(200).json({ message: "Image Deleted Successfully" });
});

// Delete specific video
const deleteVideo = catchError(async (req, res, next) => {
  const { id } = req.params;

  const gallery = await galleryModel.findOne({});

  if (!gallery) {
    return next(new AppError("Something went wrong!", 404));
  }

  const video = gallery.videos.find((video) => video._id.toString() === id);

  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  const updatedGallery = await galleryModel.findOneAndUpdate(
    {},
    { $pull: { videos: { _id: id } } },
    { new: true }
  );

  return res.status(200).json({ message: "Video Deleted Successfully" });
});

export {
  addImages,
  addVideos,
  deleteAllVideos,
  deleteAllImages,
  deleteVideo,
  getAllGallery,
  deleteImage,
};
