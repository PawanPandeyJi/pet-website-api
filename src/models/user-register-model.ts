import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserCreationAttribute extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttribute> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;
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
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
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
