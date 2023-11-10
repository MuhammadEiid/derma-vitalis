import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import appointmentRouter from "./modules/Appointment/appointmentRouter.js";
import authRouter from "./modules/Authentication/authRouter.js";
import adminRouter from "./modules/admin/adminRouter.js";
import blogRouter from "./modules/blog/Blog.Router.js";
import doctorRouter from "./modules/doctor/doctorRouter.js";
import galleryRouter from "./modules/gallery/Gallery.Router.js";
import reviewRouter from "./modules/review/reviewRouter.js";
import serviceRouter from "./modules/services/Service.Router.js";
import userRouter from "./modules/user/userRouter.js";
import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/auth/admin", adminRouter);
  app.use("/doctor", doctorRouter);
  app.use("/reviews", reviewRouter);
  app.use("/blogs", blogRouter);
  app.use("/appointment", appointmentRouter);
  app.use("/gallery", galleryRouter);
  app.use("/service", serviceRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint not found", 404));
  });

  app.use(globalErrorHandler);
}
