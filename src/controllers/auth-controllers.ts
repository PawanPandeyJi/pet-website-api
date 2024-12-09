import { Request, Response } from "express";
import { User, UserCreationAttribute } from "../models/user-register-model";
import { createUser } from "../utils/user-db";
import { generateRefreshToken, generateToken } from "../utils/token";
import { compare } from "bcrypt";

export const signUp = async (
  req: Request<Record<string, string>, void, UserCreationAttribute>,
  res: Response
): Promise<void> => {
  try {
    const emailExist = await User.findOne({ where: { email: req.body.email } });
    if (emailExist) {
      res.status(409).json({ message: "Email already exist!!" });
      return;
    }
    const createdUserData = await createUser(req.body);
    res.status(201).json({
      message: "User created successfully!",
      token: generateToken(createdUserData),
      refreshToken: generateRefreshToken(createdUserData)
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
    console.log(error);
  }
};

export type LoginReqBody = {
  email: string;
  password: string;
};

export const login = async (
  req: Request<Record<string, string>, void, LoginReqBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const validEmail = await User.findOne({ where: { email } });
    if (!validEmail) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const isPasswordMatched = await compare(password, validEmail.password);
    if (validEmail && isPasswordMatched) {
      res.status(200).json({
        message: "Login Successfully",
        token: generateToken(validEmail),
        refreshToken: generateRefreshToken(validEmail)
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const loggedInUserDetails = (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
  }
};
