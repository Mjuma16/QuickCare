import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
} from "../Controllers/adminController.js";
const router = express.Router();

router.route("/getAllUsers").get(authMiddleware, getAllUsersController);
router.route("/getAllDoctors").get(authMiddleware, getAllDoctorsController);
router
  .route("/changeAccountStatus")
  .post(authMiddleware, changeAccountStatusController);

export default router;
