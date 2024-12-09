import { Router } from "express";
import { loggedInUserDetails, login, signUp } from "../controllers/auth-controllers";
import { validateUserData } from "../middlewares/validation-middleware";
import { userLoginValidationSchema, userValidationSchema } from "../validations/user-validation";
import { authenticatingUser } from "../middlewares/token-verification";

const authRouter = Router();

authRouter.route("/signup").post(validateUserData(userValidationSchema),signUp);

authRouter.route("/login").post(validateUserData(userLoginValidationSchema),login);

authRouter.route("/user").get(authenticatingUser, loggedInUserDetails);

export default authRouter;
