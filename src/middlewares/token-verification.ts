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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  iat?: number;
  exp?: number;
};

export const authenticateUser =
  (userType: UserType | "*") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer", "").trim();
    if (!token) {
      res.status(401).json({ message: "Unathorized user, token not provided!" });
      return;
    }
    try {
      const secretKey = getENV("JWT_SECRET_KEY");
      const decodeToken = verify(token, secretKey) as JwtPayLoad;
      const tokenUserType = decodeToken.type;
      if (userType === "*") {
        tokenUserType;
      }
      const user = await User.findOne({
        where: { id: decodeToken.id, type: tokenUserType },
      });
      if (!user) {
        res.status(401).json({ message: "User not found!" });
        return;
      }
      if (user?.type !== tokenUserType) {
        res.status(403).json({ message: `Token is a ${tokenUserType} type` });
        return;
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
