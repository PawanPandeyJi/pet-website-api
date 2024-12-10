import { Router } from "express";
import { gettingPetDetails, petRegistration } from "../controllers/user-controller";
import { authenticatingUser } from "../middlewares/token-verification";
import { validateUserData } from "../middlewares/validation-middleware";
import { petValidationSchema } from "../validations/pet-validation";

const userRouter = Router();

userRouter
  .route("/pet")
  .post(authenticatingUser, validateUserData(petValidationSchema), petRegistration);

userRouter.route("/pet").get(authenticatingUser, gettingPetDetails);

export default userRouter;
