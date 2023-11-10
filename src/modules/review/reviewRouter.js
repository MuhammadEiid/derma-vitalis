import express from "express";
import * as review from "./reviewController.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), review.addReview)
  .get(review.getAllReviews);
reviewRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("user"), review.updateReview)
  .delete(protectedRoutes, allowedTo("user"), review.deleteReview)
  .get(review.getReview);

export default reviewRouter;
