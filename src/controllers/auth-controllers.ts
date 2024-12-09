import { Request, Response } from "express";
import { User, UserAttributes, UserCreationAttribute } from "../models/user-register-model";
import { Credential, CredentialCreationAttribute } from "../models/user-credentials-model";

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
    });

    await Credential.create({
      email: req.body.email,
      password: req.body.password,
      userId: user.id,
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    // Throw 500
  }
};
