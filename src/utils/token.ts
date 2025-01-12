import { UserAttributes } from "../models/user-register-model";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: UserAttributes) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("Process env not set : JWT_SECRET_KEY");
  }
  const payLoad = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    type: user.type,
  };
  return jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
    expiresIn: "30m",
  });
};

