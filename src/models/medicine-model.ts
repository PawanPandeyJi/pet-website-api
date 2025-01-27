import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Prescription } from "./prescription-model";
import { Dosage } from "./medicineDosage-model";

export type MedicineAttributes = {
  id: string;
  drugName: string;
  prescriptionId?: string;
};

export type MedicineCreationAttribute = Omit<MedicineAttributes, "id">;

export class Medicine
  extends Model<MedicineAttributes, MedicineCreationAttribute>
  implements MedicineAttributes
{
  public id!: string;
  public drugName!: string;
  public prescriptionId!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Medicine.belongsTo(Prescription, {
      foreignKey: "prescriptionId",
      as: "prescriptionOfMedicine",
    });
    Medicine.hasOne(Dosage, {
        foreignKey: "medicineId",
        as: "dosageOfMedicine"
    })
  }
}

Medicine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    drugName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "drug_name",
    },

    prescriptionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "prescription_id",
      references: {
        model: "prescriptions",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "medicines",
    timestamps: true,
  }
);
