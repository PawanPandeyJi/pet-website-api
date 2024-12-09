import { UserAttributes } from "../models/user-register-model";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: UserAttributes) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("Process env not set : JWT_SECRET_KEY");
  }
  const payLoad = {
    user_id: user.id,
    user_firstName: user.firstName,
    user_lastName: user.lastName,
    user_email: user.email,
  };
  return jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
    expiresIn: "30m",
  });
};

