import { Router } from "express";
import { validateUserData } from "../middlewares/validation-middleware";
import { doctorValidationSchema } from "../validations/doctor-validation";
import { registerDoctor } from "../controllers/doctor-controller";
import multer from "multer";
import { authenticatingUser } from "../middlewares/token-verification";

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
  .route("/register")
  .post(
    authenticatingUser,
    upload.fields([{ name: "profileImage" }, { name: "certificateImage" }]),
    validateUserData(doctorValidationSchema),
    registerDoctor
  );

export default doctorRouter;
