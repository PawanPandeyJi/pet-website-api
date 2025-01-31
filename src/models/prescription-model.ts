import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Appointment } from "./appointment-model";
import { Medicine } from "./medicine-model";

export type PrescriptionAttributes = {
  id: string;
  diagnosis: string;
  remarks: string;
  appointmentId: string;
};

export type PrescriptionCreationAttribute = Omit<PrescriptionAttributes, "id">;

export class Prescription
  extends Model<PrescriptionAttributes, PrescriptionCreationAttribute>
  implements PrescriptionAttributes
{
  public id!: string;
  public diagnosis!: string;
  public remarks!: string;
  public appointmentId!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Prescription.belongsTo(Appointment, {
      foreignKey: "appointmentId",
      as: "appointmentOfPrescription",
    });

    Prescription.hasMany(Medicine, {
      foreignKey: "prescriptionId",
      as: "medicineOfPrescription"
    })
  }
}

Prescription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    diagnosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "appointment_id",
      references: {
        model: "appointments",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "prescriptions",
    timestamps: true,
  }
);
