import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { getENV } from "../utils/envCheck";
import { User, UserType } from "../models/user-register-model";

declare module "express" {
  interface Request {
    user?: User | null;
  }
}

type JwtPayLoad = {
  user_id: string;
  user_firstName: string;
  user_lastName: string;
  user_email: string;
  user_type: string;
  iat?: number;
  exp?: number;
};


export const authenticatingUser =
  (userType: UserType|"*") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer", "").trim();
    if (!token) {
      res.status(409).json({ message: "Unathorized user, token not provided!" });
      return;
    }
    try {
      const secretKey = getENV("JWT_SECRET_KEY");
      const decodeToken = verify(token, secretKey) as JwtPayLoad;
        const user = await User.findOne({
          where: { id: decodeToken.user_id,type: decodeToken.user_type },
        });

      if (!user) {
        res.status(401).json({ message: "User not found!" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(401).json({ message: "Token has expired!" });
      } else {
        res.status(500).json({ message: "Internal server error", error });
      }
    }
  };
