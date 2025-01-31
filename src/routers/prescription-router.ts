import { Router } from "express";
import { authenticateUser } from "../middlewares/token-verification";
import { UserType } from "../models/user-register-model";
import { createPrescription, getPrescriptions } from "../controllers/prescription-controllers";

const prescriptionRouter = Router();

prescriptionRouter
  .route("/prescription")
  .post(
    authenticateUser(UserType.Doctor),
    createPrescription
  );

  prescriptionRouter
  .route("/prescription")
  .get(
    authenticateUser(UserType.Doctor),
    getPrescriptions
  );

export default prescriptionRouter;
