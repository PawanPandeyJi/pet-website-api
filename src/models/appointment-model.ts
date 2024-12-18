import { sequelize } from "../utils/db";
import { Model, DataTypes } from "sequelize";
import { User } from "./user-register-model";
import { Doctor } from "./doctor-model";
import { Pet } from "./pet-model";

export type AppointmentAttribute = {
  id: string;
  userId: string;
  doctorId: string;
  petId: string;
  appointmentDay: string;
};

export type AppointmentCreationAttribute = Omit<AppointmentAttribute, "id">;

export class Appointment
  extends Model<AppointmentAttribute, AppointmentCreationAttribute>
  implements AppointmentAttribute
{
  public id!: string;
  public userId!: string;
  public doctorId!: string;
  public petId!: string;
  public appointmentDay!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Appointment.belongsTo(User, {
        foreignKey: "userId",
        as: "appointmentOfUserPet"
    })
    Appointment.belongsTo(Doctor, {
        foreignKey: "doctorId",
        as: "appointmentToDoctor"
    })
    Appointment.belongsTo(Pet, {
        foreignKey: "petId",
        as: "appointmentToPet"
    })
  }
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "users_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "doctors_id",
      references: {
        model: "doctors",
        key: "id",
      },
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "pets_id",
      references: {
        model: "pets",
        key: "id",
      },
    },
    appointmentDay: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "apointment_day",
    },
  },
  {
    sequelize,
    tableName: "appointments",
    timestamps: true,
  }
);