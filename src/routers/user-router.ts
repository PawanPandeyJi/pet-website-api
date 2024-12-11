import { Router } from "express";
import { deletePet, gettingPetDetails, petRegistration } from "../controllers/user-controller";
import { authenticatingUser } from "../middlewares/token-verification";
import { validateUserData } from "../middlewares/validation-middleware";
import { petValidationSchema } from "../validations/pet-validation";
import multer from "multer";

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
    authenticatingUser,
    upload.single("image"),
    validateUserData(petValidationSchema),
    petRegistration
  );

userRouter.route("/pet").get(authenticatingUser, gettingPetDetails);
userRouter.route("/pet/:id").put(authenticatingUser, deletePet);

export default userRouter;
