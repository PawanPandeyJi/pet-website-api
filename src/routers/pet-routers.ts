import { Router } from "express";
import {
  deletePet,
  getDoctors,
  gettingPetDetails,
  petRegistration,
} from "../controllers/user-controller";
import { authenticatingUser } from "../middlewares/token-verification";
import { validateUserData } from "../middlewares/validation-middleware";
import { petValidationSchema } from "../validations/pet-validation";
import multer from "multer";
import { UserType } from "../models/user-register-model";

const petRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

petRouter
  .route("/pet")
  .post(
    authenticatingUser(UserType.User),
    upload.single("image"),
    validateUserData(petValidationSchema),
    petRegistration
  );

petRouter.route("/pet").get(authenticatingUser(UserType.User), gettingPetDetails);
petRouter.route("/pet/:id").put(authenticatingUser(UserType.User), deletePet);
petRouter.route("/doctors").get(getDoctors);

export default petRouter;