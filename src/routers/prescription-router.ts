import { Router } from "express";
import { authenticateUser } from "../middlewares/token-verification";
import { UserType } from "../models/user-register-model";
import { createPrescription, getPrescriptions, getPrescriptionsForUser } from "../controllers/prescription-controllers";

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

  prescriptionRouter
  .route("/userPrescription")
  .get(
    authenticateUser(UserType.User),
    getPrescriptionsForUser
  );

export default prescriptionRouter;
