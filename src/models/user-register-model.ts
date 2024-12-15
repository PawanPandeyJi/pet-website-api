import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Credential } from "./user-credentials-model";
import { Pet } from "./pet-model";
import { Doctor } from "./doctor-model";

export enum UserType {
  Doctor = "doctor",
  User = "user",
}

export type UserAttributes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type?: UserType;
};

export type UserCreationAttribute = Omit<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttribute> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public type!: UserType;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    User.hasOne(Credential, {
      foreignKey: "userId",
      as: "credential",
    });

    User.hasMany(Pet, {
      foreignKey: "userId",
      as: "pet",
    });

    User.hasOne(Doctor, {
      foreignKey: "userId",
      as: "doctorRegistraion",
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
    type: {
      type: DataTypes.ENUM("user", "doctor"),
      allowNull: true,
    },
  },

  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
