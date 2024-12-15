import { Request, Response } from "express";
import { User, UserCreationAttribute } from "../models/user-register-model";
import { Credential, CredentialCreationAttribute } from "../models/user-credentials-model";
import { createUser } from "../utils/user-db";
import { generateAccessToken } from "../utils/token";
import { compare } from "bcrypt";

export const signUp = async (
  req: Request<Record<string, string>, void, UserCreationAttribute & CredentialCreationAttribute>,
  res: Response
): Promise<void> => {
  try {
    const emailExist = await Credential.findOne({ where: { email: req.body.email } });
    if (emailExist) {
      res.status(409).json({ message: "Email already exist!!" });
      return;
    }

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      type: req.body.type,
    });

    await createUser(req.body, user);

    res.status(200).json({ user, token: generateAccessToken(user) });
  } catch (error) {
    res.status(401).json(error);
  }
};

export type LoginReqBody = {
  email: string;
  password: string;
  type: string;
};

export const login = async (
  req: Request<Record<string, string>, void, LoginReqBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, type } = req.body;
    const validCredential = await Credential.findOne({
      where: { email },
      include: [
        { model: User, as: "users", attributes: ["id", "firstName", "lastName", "email", "type"] },
      ],
    });
    if (!validCredential || !validCredential.users) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const user = validCredential.users;
    const isPasswordMatched = await compare(password, validCredential.password);
    if (validCredential && isPasswordMatched) {
      res.status(200).json({
        message: "Login Successfully",
        token: generateAccessToken(user),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

export const user = (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(401).json(error);
  }
};
