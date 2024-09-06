import DoctorModel from "../Models/doctorModels.js";
import AppointmentModel from "../Models/appointmentModel.js";
import UserModel from "../Models/userModels.js";

export const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Fetch Doctor Information successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctor Info",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor account updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update doctor account",
      error,
    });
  }
};

export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Fetch Single Doctor Info Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "issues in fetching single doctor",
    });
  }
};

export const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ userId: req.body.userId });
    const appointments = await AppointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Doctor Appointments",
      error,
    });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await AppointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await UserModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    user.notification.push({
      type: "status-updated",
      message: `your Appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Failed to updated status",
    });
  }
};
