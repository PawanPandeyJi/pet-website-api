import { hash } from "bcrypt";
import {
  User,
  UserCreationAttribute,
} from "../models/user-register-model";


export const createUser = async (user: UserCreationAttribute) => {
  const hash_password = await hash(user.password, 10);
  user.password = hash_password;
  return User.create(user);
};
