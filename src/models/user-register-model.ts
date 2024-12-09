import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Credential } from "./user-credentials-model";

export type UserAttributes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UserCreationAttribute = Omit<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttribute> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    User.hasOne(Credential, {
      foreignKey: "userId",
      as: "credential",
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
