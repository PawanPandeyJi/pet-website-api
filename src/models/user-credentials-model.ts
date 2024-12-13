import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { User } from "./user-register-model";

export type CredentialAttributes = {
  id: string;
  email: string;
  password: string;
  type?: string;
  userId: string;
};

export type CredentialCreationAttribute = Omit<CredentialAttributes, "id">;

export class Credential
  extends Model<CredentialAttributes, CredentialCreationAttribute>
  implements CredentialAttributes
{
  public id!: string;
  public email!: string;
  public password!: string;
  public type!: string;
  public userId!: string;

  public users?: User;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Credential.belongsTo(User, {
      foreignKey: "userId",
      as: "users",
    });
  }
}

Credential.init(
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
    type: {
      type: DataTypes.ENUM("user", "doctor"),
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
  },

  {
    sequelize,
    tableName: "credentials",
    timestamps: true,
  }
);
