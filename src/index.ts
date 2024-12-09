import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./utils/db";

import cors from "cors";
import authRouter from "./routers/auth-routers";
import { healthController } from "./controllers/health.controller";
import { User } from "./models/user-register-model";
import { Credential } from "./models/user-credentials-model";

const app = express();
app.use(express.json());

const corsPolicy = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
  credentials: true,
};
app.use(cors(corsPolicy));

app.get("/health", healthController);
app.use("/api/auth/", authRouter);

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
