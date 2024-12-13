import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./utils/db";
import cors from "cors";
import authRouter from "./routers/user-auth-routers";
import { healthController } from "./controllers/health.controller";
import { User } from "./models/user-register-model";
import { Credential } from "./models/user-credentials-model";
import userRouter from "./routers/user-router";
import { Pet } from "./models/pet-model";
import { Doctor } from "./models/doctor-model";
import { DoctorShedule } from "./models/doctor-shedule-model";
import doctorRouter from "./routers/doctor-router";

const app = express();
app.use(express.json());
app.use(express.static("./images"));

const corsPolicy = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
  credentials: true,
};
app.use(cors(corsPolicy));

app.get("/health", healthController);
app.use("/api/auth/", authRouter);
app.use("/api/user/", userRouter);
app.use("/api/doctor/", doctorRouter);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.log("Error while sync database", error);
  });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
User.associate();
Credential.associate();
Pet.associate();
Doctor.associate();
DoctorShedule.associate();
