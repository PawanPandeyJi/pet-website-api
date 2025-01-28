import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Prescription } from "./prescription-model";

export type MedicineAttributes = {
  id: string;
  drugName: string;
  doseTime: string;
  frequency: string;
  dose: string;
  drugForm: string;
  duration: string;
  prescriptionId?: string;
};

export type MedicineCreationAttribute = Omit<MedicineAttributes, "id">;

export class Medicine
  extends Model<MedicineAttributes, MedicineCreationAttribute>
  implements MedicineAttributes
{
  public id!: string;
  public drugName!: string;
  public doseTime!: string;
  public frequency!: string;
  public dose!: string;
  public drugForm!: string;
  public duration!: string;
  public prescriptionId!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Medicine.belongsTo(Prescription, {
      foreignKey: "prescriptionId",
      as: "prescriptionOfMedicine",
    });
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

    doseTime: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "dose_time"
      },
  
      frequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      dose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      drugForm: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "drug_form"
      },
  
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
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
