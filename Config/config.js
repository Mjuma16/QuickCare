import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const res = await mongoose.connect(
      "mongodb://127.0.0.1:27017/doctor-appointment-system"
    );
    console.log(
      `MongoDB connected at port ${res.connection.port}`.bgYellow.white
    );
  } catch (error) {
    console.log(`Database connection error ${error}`.bgRed.white);
  }
};
