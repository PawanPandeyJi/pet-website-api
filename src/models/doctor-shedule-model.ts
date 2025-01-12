import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Doctor } from "./doctor-model";

export type DoctorSheduleAttribute = {
  id: string;
  availableDays: string;
  availableTimeFrom: string;
  availableTimeTo: string;
  doctorId: string;
};

export type DoctorSheduleCreationAttribute = Omit<DoctorSheduleAttribute, "id">;

export class DoctorShedule
  extends Model<DoctorSheduleAttribute, DoctorSheduleCreationAttribute>
  implements DoctorSheduleAttribute
{
  public id!: string;
  public availableDays!: string;
  public availableTimeFrom!: string;
  public availableTimeTo!: string;
  public doctorId!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    DoctorShedule.belongsTo(Doctor, {
      foreignKey: "doctorId",
      as: "DoctorShedule",
    });
  }
}

DoctorShedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    availableDays: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    availableTimeFrom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availableTimeTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "doctor_id",
      references: {
        model: "doctors",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "doctorshedules",
    timestamps: true,
  }
);
