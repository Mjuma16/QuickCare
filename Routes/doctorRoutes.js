import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} from "../Controllers/doctorController.js";

const router = express.Router();
router.route("/getDoctorInfo").post(authMiddleware, getDoctorInfoController);
router.route("/updateProfile").post(authMiddleware, updateProfileController);
router.route("/getDoctorById").post(authMiddleware, getDoctorByIdController);
router
  .route("/doctor-appointments")
  .get(authMiddleware, doctorAppointmentsController);
router.route("/update-status").post(authMiddleware, updateStatusController);

export default router;
