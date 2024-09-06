import DoctorModel from "../Models/doctorModels.js";
import UserModel from "../Models/userModels.js";
export const getAllUsersController = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send({
      success: true,
      message: "Fatch users successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fatch all users",
      error,
    });
  }
};
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({});
    res.status(200).send({
      success: true,
      messsage: "Fetched all doctors successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fatch all doctors",
      error,
    });
  }
};

export const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await DoctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await UserModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-account-response",
      message: `Your Doctor Account has been ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to change account status",
      error,
    });
  }
};
