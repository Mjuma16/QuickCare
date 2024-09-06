import UserModel from "../Models/userModels.js";
import DoctorModel from "../Models/doctorModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import AppointmentModel from "../Models/appointmentModel.js";
import moment from "moment";

//register user controller
export const registerUser = async (req, res, next) => {
  try {
    const existUser = await UserModel.findOne({ email: req.body.email });
    if (existUser) {
      return res.status(200).send({
        success: false,
        message: "User already exist! pls try again",
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Issue in Register Controller ${error.message}`,
    });
  }
};

//login user controller
export const loginUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "Invalid email address! pls try again",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(200).send({
        message: "Invalid password! pls try again",
        success: false,
      });
    }

    //jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, {
      expiresIn: "1d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Failed to login user ${error.message}`,
    });
  }
};

//get User Data
export const authController = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "User Not Found ",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth Error",
      success: false,
      error,
    });
  }
};

//apply for doctor account controller
export const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await DoctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await UserModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await UserModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(200).send({
      success: true,
      message: "Doctor account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to apply for doctor account",
      error,
    });
  }
};

// get all notification controller
export const getAllNotificationController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in notification",
      error,
    });
  }
};

//delete all notification controller
export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Delete all notifications successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "failed to delete all notification",
      error,
    });
  }
};

export const getDoctorsListController = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "fetch doctors list successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "failed to fetch all doctors",
      error,
    });
  }
};

//Book Appointment Controller
export const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();
    const user = await UserModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

//checking availability
export const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointmens = await AppointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointmens.length > 0) {
      return res.status(200).send({
        message: "Appointment not available at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};

export const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Fetch User Appointments Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in user appointments list",
    });
  }
};
