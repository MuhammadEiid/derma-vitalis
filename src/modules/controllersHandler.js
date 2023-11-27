import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/catchError.js";
import { APIFeatures } from "../utils/APIFeature.js";
import bcrypt from "bcrypt";
import { userModel } from "../../Database/models/User.model.js";
import { doctorModel } from "../../Database/models/Doctor.model.js";

// Add User or Admin or Doctor
const addOne = (model, type, role) => {
  return catchError(async (req, res, next) => {
    let email = req.body.email;

    const emailExists = await model.findOne({ email });
    if (emailExists) {
      return next(new AppError("This email already exists", 400));
    }

    // If User Added Profile Picture
    if (req.file) {
      req.body.profilePic = req.file.profilePic;
    }

    if (role === "admin" || role === "doctor") {
      req.body.verified = true;
    }
    const document = new model({
      ...req.body,
      createdBy: req.user._id,
    });

    let response = {};
    response[type] = document;
    await document.save();
    res.status(200).json({
      message: `${type} Added Successfully`,
      response,
    });
  });
};

// Get All Data
const getAll = (model, type, role) => {
  return catchError(async (req, res, next) => {
    let apiFeatures = new APIFeatures(model.find(), req.query)
      .fields()
      .pagination()
      .search()
      .sort();

    if (role === "admin") {
      apiFeatures.filter().mongooseQuery.find({ role: "admin" });
    }

    const document = await apiFeatures.mongooseQuery;

    let response = {};
    response[type] = document;

    if (document.length > 0) {
      res.status(200).json({
        message: "Success",
        page: apiFeatures.page,
        response,
      });
    } else {
      next(new AppError(`No ${type} Found`, 404));
    }
  });
};

const getUserSpecificItem = (model, param) => {
  return catchError(async (req, res, next) => {
    let apiFeatures = new APIFeatures(
      model.find({ _id: req.user.id }).select(`${param}`).populate(`${param}`),
      req.query
    ).pagination();

    const document = await apiFeatures.mongooseQuery;

    let response = {};
    response = document;

    if (document.length > 0) {
      res.status(200).json({
        page: apiFeatures.page,
        response,
      });
    } else {
      next(new AppError(`Not Found`, 404));
    }
  });
};

// Update User or Admin or Doctor Profile
const updateProfile = (model, type) => {
  return catchError(async (req, res, next) => {
    const { name } = req.body;
    // If User or Doctor Updated Profile Picture
    if (req.file) {
      req.body.profilePic = req.file.filename;
    }
    if (req.body.name) {
      if (!name || (!name.en && !name.ar)) {
        return next(
          new AppError("Please provide a name in English or Arabic", 400)
        );
      }
    }

    let document = await model.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });

    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `${type} Updated Successfully`,
        response,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

const deleteUser = (model, type) => {
  return catchError(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `${type} is Deleted Successfully`,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

// To change password for a user/doctor from admin panel
const changeUserPasword = (model, type) => {
  return catchError(async (req, res, next) => {
    const { newPassword } = req.body;
    const { id } = req.params;

    let passwordChangedAt = Date.now();

    const document = await model.findByIdAndUpdate(
      id,
      {
        password: newPassword,
        passwordChangedAt,
        isActive: false,
        isBlocked: false,
      },
      { new: true }
    );

    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `Password Changed Successfully`,
      });
    } else {
      return next(new AppError(`${type} Not Found`, 404));
    }
  });
};

// Change Password
const changePassword = (model, type) => {
  return catchError(async (req, res, next) => {
    const { oldPassword, newPassword, repeat_password } = req.body;
    const { _id } = req.user;
    let passwordChangedAt = Date.now();

    const user = await model.findById(_id);

    if (!user) {
      return next(new AppError("Something went wrong!", 404));
    }

    if (!user.isActive || user.isBlocked) {
      return next(new AppError("Please Login First", 401));
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return next(new AppError("Current password is incorrect", 401));
    }

    if (newPassword !== repeat_password) {
      return next(new AppError("Please Re-enter the password", 401));
    }

    const document = await model.findByIdAndUpdate(
      _id,
      { password: newPassword, passwordChangedAt },
      { new: true }
    );

    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `Password updated  Successfully`,
      });
    } else {
      return next(new AppError(`${type} Not Found`, 404));
    }
  });
};

const getOne = (model, type) => {
  return catchError(async (req, res, next) => {
    const { id } = req.params;

    let document = await model.findById(id);
    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `${type} Found Successfully`,
        response,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};
const checkEmail = (type) => {
  return catchError(async (req, res, next) => {
    const { email } = req.body;

    let document = await userModel.findOne({ email: email.toLowerCase() });

    if (!document) {
      document = await doctorModel.findOne({ email: email.toLowerCase() });
    }

    if (document) {
      return next(new AppError(`${type} already exists`, 404));
    }
    let response = {};
    response[type] = document;

    res.status(200).json({
      message: `${type} Not found`,
    });
  });
};

const getUserProfile = (model, type) => {
  return catchError(async (req, res, next) => {
    let document = await model.findById(req.user._id);
    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        response,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

const logout = (model, type) => {
  return catchError(async (req, res, next) => {
    let user = await model.findByIdAndUpdate(
      req.user._id,
      {
        isActive: false,
      },
      { new: true }
    );

    let response = {};
    response[type] = user;

    if (user) {
      res.status(200).json({
        message: `Logout Successfully`,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

export {
  addOne,
  changeUserPasword,
  getAll,
  updateProfile,
  changePassword,
  getOne,
  deleteUser,
  logout,
  getUserProfile,
  getUserSpecificItem,
  checkEmail,
};
