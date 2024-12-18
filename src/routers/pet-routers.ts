import { Router } from "express";
import {
  createAppointment,
  deletePet,
  getDoctors,
  gettingPetDetails,
  petRegistration,
} from "../controllers/user-controller";
import { authenticateUser } from "../middlewares/token-verification";
import { validateUserData } from "../middlewares/validation-middleware";
import { petValidationSchema } from "../validations/pet-validation";
import multer from "multer";
import { UserType } from "../models/user-register-model";
import { appointmentSchema } from "../validations/appointment-validation";

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
    authenticateUser(UserType.User),
    upload.single("image"),
    validateUserData(petValidationSchema),
    petRegistration
  );

petRouter.route("/pet").get(authenticateUser(UserType.User), gettingPetDetails);
petRouter.route("/pet/:id").put(authenticateUser(UserType.User), deletePet);
petRouter.route("/doctors").get(getDoctors);
petRouter
  .route("/appointment")
  .post(authenticateUser(UserType.User), validateUserData(appointmentSchema), createAppointment);

export default petRouter;
