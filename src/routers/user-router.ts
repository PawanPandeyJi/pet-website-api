import { Router } from "express";
import { deletePet, gettingPetDetails, petRegistration } from "../controllers/user-controller";
import { authenticatingUser } from "../middlewares/token-verification";
import { validateUserData } from "../middlewares/validation-middleware";
import { petValidationSchema } from "../validations/pet-validation";
import multer from "multer";
import { UserType } from "../models/user-register-model";


const userRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

userRouter
  .route("/pet")
  .post(
    authenticatingUser(UserType.User),
    upload.single("image"),
    validateUserData(petValidationSchema),
    petRegistration
  );

userRouter.route("/pet").get(authenticatingUser(UserType.User), gettingPetDetails);
userRouter.route("/pet/:id").put(authenticatingUser(UserType.User), deletePet);

export default userRouter;
