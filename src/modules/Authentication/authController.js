import { userModel } from "../../../Database/models/User.model.js";
import { doctorModel } from "../../../Database/models/Doctor.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { verifyHTML } from "../../utils/nodemailer/verifyHTML.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/nodemailer/sendEmail.js";

// ----------------------------------------------------------- //
// ------------------------- Register --------------------------- //
const signup = catchError(async (req, res, next) => {
  const { name, email, password, repeat_password, phone, gender } = req.body;

  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new AppError("Email already exists", 409));
  }

  let token = jwt.sign(
    {
      email,
    },
    process.env.EMAIL_SIGNATURE,
    {
      expiresIn: 60 * 60 * 5,
    }
  );

  let refreshToken = jwt.sign(
    {
      email,
    },
    process.env.EMAIL_SIGNATURE,
    {
      expiresIn: 60 * 60 * 24,
    }
  );

  let link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  let refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`;

  let activationHTML = verifyHTML(link, refreshLink);

  await sendEmail({
    to: email,
    subject: "Activate your Account",
    html: activationHTML,
  });

  const newUser = await userModel.create({
    name,
    email,
    password,
    phone,
    gender,
  });
  return res.status(201).json({
    message:
      "User Registered Successfully, Please Check your mailbox to verify your account",
    newUser,
  });
});

const activateAccount = catchError(async (req, res, next) => {
  const { token } = req.params;

  jwt.verify(token, process.env.EMAIL_SIGNATURE, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    } else {
      const email = decoded.email;
      if (!decoded.email) {
        return next(
          new AppError(
            "Oops! Looks like you don't have an account yet, please register",
            404
          )
        );
      }
      let user = await userModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        { verified: true },
        { new: true } // Return the updated document
      );
      if (!user) {
        return next(
          new AppError(
            "Oops! Looks like you don't have an account yet, please register",
            404
          )
        );
      }

      if (user.verified) {
        // return res.redirect(process.env.FRONTEND_LOGIN_URL);
        return res.status(200).json({
          message: "You will redirected to the login page",
        });
      }

      // matchedCount is the number of documents found for email
      if (user.matchedCount) {
        // return res.redirect(process.env.FRONTEND_LOGIN_URL);
        return res.status(201).json({
          message:
            "Account Verified Successfully, You will redirected to the login page",
        });
      } else {
        // return res.status(404).redirect(process.env.FRONTEND_REGISTER_URL); //Signup page
        return next(
          new AppError(
            "Oops! Looks like you you don't have account yet, please register",
            404
          )
        );
      }
    }
  });
});

const newConfirmEmail = catchError(async (req, res, next) => {
  const { token } = req.params;

  jwt.verify(token, process.env.EMAIL_SIGNATURE, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    } else {
      const email = decoded.email;
      if (!email) {
        return next(new AppError("Invalid Token", 400));
      }

      // Update the user document and retrieve the updated document
      let user = await userModel.findOne({ email: email.toLowerCase() });

      if (!user) {
        return next(
          new AppError(
            "Oops! Looks like you don't have an account yet, please register",
            404
          )
        );
      }

      if (user.verified) {
        // return res.redirect(process.env.FRONTEND_LOGIN_URL);
        return res.status(200).json({
          message: "You will be redirected to the login page",
        });
      }

      let newToken = jwt.sign(
        {
          email,
        },
        process.env.EMAIL_SIGNATURE,
        {
          expiresIn: 60 * 2,
        }
      );
      let link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
      let refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;

      // Send the new verification email
      await sendEmail({
        to: email,
        subject: "Activate your account",
        html: verifyHTML(link, refreshLink),
      });

      return res
        .status(200)
        .send(
          `<p style="color:red">A New Verification Email Has Been Sent To Your Inbox</p>`
        );
    }
  });
});

// ----------------------------------------------------------- //
// ------------------------- Login --------------------------- //

const login = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await doctorModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await userModel.findOne({ email: email.toLowerCase() });
  }

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.verified) {
    return next(
      new AppError("User not verified, please check your email", 401)
    );
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new AppError("Incorrect password"), 401);
  }

  let token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      gender: user.gender,
      phone: user.phone,
    },
    process.env.LOGIN_TOKEN,
    {
      expiresIn: 60 * 60 * 5,
    }
  );

  let refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      gender: user.gender,
      phone: user.phone,
    },
    process.env.LOGIN_TOKEN,
    {
      expiresIn: 60 * 60 * 24 * 365,
    }
  );

  if (user instanceof doctorModel) {
    await doctorModel.findByIdAndUpdate({ _id: user.id }, { isActive: true });
  } else if (user instanceof userModel) {
    await userModel.findByIdAndUpdate({ _id: user.id }, { isActive: true });
  }

  res.status(201).json({ message: "Welcome", token, refreshToken });
});

// ----------------------------------------------------------- //
// --------------------- Authentication ---------------------- //

const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("Invalid Token"), 401);

  jwt.verify(token, process.env.LOGIN_TOKEN, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    }

    const { id, role, iat } = decoded;
    let user;

    if (role === "admin" || role === "user") {
      user = await userModel.findById(id);
    } else if (role === "doctor") {
      user = await doctorModel.findById(id);
    } else {
      return next(new AppError("Invalid role", 400));
    }

    if (!user) {
      return next(new AppError("Invalid Token", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Please login first", 401));
    }
    if (user.passwordChangedAt) {
      const changePasswordDate = parseInt(
        user.passwordChangedAt.getTime() / 1000
      );

      if (changePasswordDate > iat) {
        return next(new AppError("Please login first", 401));
      }
    }

    req.user = user;
    next();
  });
});

// ----------------------------------------------------------- //
// ---------------------- Authorization ---------------------- //

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You are not authorized to access this endpoint", 401)
      );
    next();
  });
};

export {
  protectedRoutes,
  allowedTo,
  signup,
  login,
  activateAccount,
  newConfirmEmail,
};
