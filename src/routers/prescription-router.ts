import { Router } from "express";
import { authenticateUser } from "../middlewares/token-verification";
import { UserType } from "../models/user-register-model";
import { createPrescription } from "../controllers/prescription-controllers";
import { validateUserData } from "../middlewares/validation-middleware";
import { PrescriptionSchema } from "../validations/prescription-validation";

const prescriptionRouter = Router();

prescriptionRouter
  .route("/prescription")
  .post(
    authenticateUser(UserType.Doctor),
    validateUserData(PrescriptionSchema),
    createPrescription
  );

export default prescriptionRouter;
