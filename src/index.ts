import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./utils/db";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import authRouter from "./routers/user-auth-routers";
import { healthController } from "./controllers/health.controller";
import { User } from "./models/user-register-model";
import { Credential } from "./models/user-credentials-model";
import petRouter from "./routers/pet-routers";
import { Pet } from "./models/pet-model";
import { Doctor } from "./models/doctor-model";
import { DoctorShedule } from "./models/doctor-shedule-model";
import doctorRouter from "./routers/doctor-router";
import { Appointment } from "./models/appointment-model";
import { disconnectUser } from "./controllers/pet-controller";

const app = express();

app.use(express.json());
app.use(express.static("./images"));

const corsPolicy = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
  credentials: true,
};
app.use(cors(corsPolicy));

const httpServer = createServer(app);
export const socketIo = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "GET,POST",
  },
});

socketIo.on("connection", (socket) => {
  let userId = "";
  socket.on("USER", (arg) => {
    userId = arg;
    console.log("Connected USER ID:", arg);
  });
  socket.on("disconnect", async () => {
    console.log("user disconnected....", userId);
  });
});

app.get("/health", healthController);
app.use("/auth/", authRouter);
app.use(petRouter);
app.use(doctorRouter);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.log("Error while sync database", error);
  });

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
User.associate();
Credential.associate();
Pet.associate();
Doctor.associate();
DoctorShedule.associate();
Appointment.associate();
