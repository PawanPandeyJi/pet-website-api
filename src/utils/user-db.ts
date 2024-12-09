import { hash } from "bcrypt";
import { Credential, CredentialCreationAttribute } from "../models/user-credentials-model";

export const createUser = async (
  credentials: CredentialCreationAttribute,
  user: { id: string }
) => {
  const hash_password = await hash(credentials.password, 10);
  credentials.password = hash_password;
  credentials.userId = user.id;
  return Credential.create(credentials);
};
