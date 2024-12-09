import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../utils/db";

export type UserAttributes =  {
  id: string;
  firstName: string;
  lastName: string;
}

export type UserCreationAttribute = Optional<UserAttributes, "id"> 

export class User extends Model<UserAttributes, UserCreationAttribute> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;

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
    }
  },

  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
