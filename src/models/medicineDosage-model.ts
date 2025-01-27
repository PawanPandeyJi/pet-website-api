import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Medicine } from "./medicine-model";

export type MedicineDosageAttributes = {
  id: string;
  doseTime: string;
  frequency: string;
  dose: string;
  drugForm: string;
  duration: string;
  medicineId?: string;
};

export type MedicineDosageCreationAttribute = Omit<MedicineDosageAttributes, "id">;

export class Dosage
  extends Model<MedicineDosageAttributes, MedicineDosageCreationAttribute>
  implements MedicineDosageAttributes
{
  public id!: string;
  public doseTime!: string;
  public frequency!: string;
  public dose!: string;
  public drugForm!: string;
  public duration!: string;
  public medicineId!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

    static associate() {
      Dosage.belongsTo(Medicine, {
        foreignKey: "medicineId",
        as: "medicineForDosage",
      });

    }
}

Dosage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    medicineId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "medicine_id",
      references: {
        model: "medicines",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "dosages",
    timestamps: true,
  }
);
