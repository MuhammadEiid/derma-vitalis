import { serviceModel } from "../../../Database/models/Services.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

// Add service
const addService = catchError(async (req, res, next) => {
  const { title, description } = req.body;

  req.body.imageCover = req.file.filename;

  if (!title || (!title.en && !title.ar)) {
    return next(
      new AppError("Please provide a title in English or Arabic", 400)
    );
  }

  if (!description || (!description.en && !description.ar)) {
    return next(
      new AppError("Please provide a description in English or Arabic", 400)
    );
  }

  const service = new serviceModel(req.body);
  if (!service) {
    return next(new AppError("Something went wrong", 404));
  }

  await service.save();

  res.status(200).json({
    message: `Service Added Successfully`,
    service,
  });
});

const getAllServices = handler.getAll(serviceModel, "Services");

const updateService = catchError(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (title) {
    if (!title.en && !title.ar) {
      return next(
        new AppError("Please provide a title in English or Arabic", 400)
      );
    }
  }
  if (description) {
    if (!description.en && !description.ar) {
      return next(
        new AppError("Please provide a description in English or Arabic", 400)
      );
    }
  }
  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  const updatedService = await serviceModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  if (!updatedService) {
    return next(new AppError("Service not found", 404));
  }

  res.status(200).json({
    message: `Service Updated Successfully`,
    updatedService,
  });
});

const deleteService = catchError(async (req, res, next) => {
  const { id } = req.params;

  const service = await serviceModel.findByIdAndDelete({
    _id: id,
  });

  if (!service) {
    return next(new AppError("Service not found", 404));
  }

  res.status(200).json({
    message: `Service Deleted Successfully`,
  });
});

const getService = handler.getOne(serviceModel, "Service");

export { addService, getAllServices, updateService, deleteService, getService };
