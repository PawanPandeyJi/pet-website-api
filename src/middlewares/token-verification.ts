import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getENV } from "../utils/envCheck";
import { User } from "../models/user-register-model";

declare module "express" {
  interface Request {
    user?: User | null;
  }
}

interface JwtPayLoad {
  user_id: string;
  user_firstName: string;
  user_lastName: string;
  user_email: string;
  iat?: number;
  exp?: number;
}

export const authenticatingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer", "").trim();
  if (!token) {
    res.status(409).json({ message: "Unathorized user, token not provided!" });
    return;
  }
  try {
    const secretKey = getENV("JWT_SECRET_KEY");
    const decodeToken = verify(token, secretKey) as JwtPayLoad;
    const loggedInUserDetails = await User.findOne({
      where: { id: decodeToken.user_id },
      attributes: { exclude: ["password"] },
    });
    if (!loggedInUserDetails) {
      res.status(404).json({ message: "User not found!" });
    }
    req.user = loggedInUserDetails;
    next();
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};
