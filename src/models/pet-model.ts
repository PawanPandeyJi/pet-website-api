import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { User } from "./user-register-model";
import { Appointment } from "./appointment-model";

export type PetAttributes = {
  id: string;
  petName: string;
  age: string;
  breed: string;
  weight: string;
  type: string;
  gender: string;
  color: string;
  image: string;
  isDeleted?: boolean;
  userId: string;
};

export type PetCreationAttribute = Omit<PetAttributes, "id">;

export class Pet extends Model<PetAttributes, PetCreationAttribute> implements PetAttributes {
  public id!: string;
  public petName!: string;
  public age!: string;
  public breed!: string;
  public weight!: string;
  public type!: string;
  public gender!: string;
  public color!: string;
  public image!: string;
  public userId!: string;
  public isDeleted!: boolean;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Pet.belongsTo(User, {
      foreignKey: "userId",
      as: "pet",
    });
    Pet.hasMany(Appointment, {
      foreignKey: "petId",
      as: "petAppointments",
    });
  }
}

Pet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    petName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "pet_name",
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_deleted",
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
    tableName: "pets",
    timestamps: true,
  }
);
