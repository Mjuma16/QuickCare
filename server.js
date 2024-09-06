import express from "express";
import colors from "colors";
import "dotenv/config";
import { connectDB } from "./Config/config.js";
import userRoutes from "./Routes/userRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
const app = express();

connectDB();

//middlewares
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_MODE} mode at port ${process.env.PORT}`
      .rainbow.underline.red
  );
});
