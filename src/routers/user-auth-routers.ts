import { Router } from "express";
import { login, signUp, user } from "../controllers/auth-controllers";
import { validateUserData } from "../middlewares/validation-middleware";
import { userLoginValidationSchema, userValidationSchema } from "../validations/user-validation";
import { authenticatingUser } from "../middlewares/token-verification";
import { UserType } from "../models/user-register-model";
import { Doctor } from "../models/doctor-model";

const authRouter = Router();

authRouter.route("/signup").post(validateUserData(userValidationSchema), signUp);

authRouter.route("/login").post(validateUserData(userLoginValidationSchema), login);

authRouter.route("/user").get(authenticatingUser("*"), user);

export default authRouter;
