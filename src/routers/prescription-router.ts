import { Router } from "express";
import { authenticateUser } from "../middlewares/token-verification";
import { UserType } from "../models/user-register-model";
import { createPrescription } from "../controllers/prescription-controllers";

const prescriptionRouter = Router()

prescriptionRouter.route('/prescription').post(authenticateUser(UserType.Doctor), createPrescription)

export default prescriptionRouter