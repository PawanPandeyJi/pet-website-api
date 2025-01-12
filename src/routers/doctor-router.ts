import { Router } from "express";
import { validateUserData } from "../middlewares/validation-middleware";
import { doctorValidationSchema } from "../validations/doctor-validation";
import { registerDoctor, getDoctorDetails } from "../controllers/doctor-controller";
import multer from "multer";
import { authenticateUser } from "../middlewares/token-verification";
import { UserType } from "../models/user-register-model";

const doctorRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

doctorRouter
  .route("/doctor")
  .post(
    authenticateUser(UserType.Doctor),
    upload.fields([{ name: "profileImage" }, { name: "certificateImage" }]),
    validateUserData(doctorValidationSchema),
    registerDoctor
  );

doctorRouter.route("/doctor").get(authenticateUser(UserType.Doctor), getDoctorDetails);

export default doctorRouter;
