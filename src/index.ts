import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./utils/db";

import cors from "cors";
import authRouter from "./routers/auth-routers";


const app = express();
app.use(express.json());

const corsPolicy = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
  credentials: true,
};
app.use(cors(corsPolicy));

app.use("/api/auth/", authRouter);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.log("Error while sync database", error);
  });

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


