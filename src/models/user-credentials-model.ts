import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export type CredentialAttributes = {
  id: string;
  email: string;
  password: string;
  userId: string;
}

export type CredentialAttribute  = Optional<CredentialAttributes, "id"> 

export class User extends Model<CredentialAttributes, CredentialAttribute> implements CredentialAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public userId!: string;

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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id"
      },
    },
  },

  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
