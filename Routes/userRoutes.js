import express from "express";
import {
  loginUser,
  registerUser,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getDoctorsListController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} from "../Controllers/userController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getUserData").post(authMiddleware, authController);
router.route("/apply-doctor").post(authMiddleware, applyDoctorController);
router
  .route("/get-all-notification")
  .post(authMiddleware, getAllNotificationController);
router
  .route("/delete-all-notification")
  .post(authMiddleware, deleteAllNotificationController);

router.route("/getDoctorsList").get(authMiddleware, getDoctorsListController);

router
  .route("/book-appointment")
  .post(authMiddleware, bookAppointmentController);

router
  .route("/booking-availability")
  .post(authMiddleware, bookingAvailabilityController);

//appointment list
router
  .route("/user-appointments")
  .get(authMiddleware, userAppointmentsController);

export default router;
