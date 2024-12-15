import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { DoctorShedule } from "./doctor-shedule-model";
import { User } from "./user-register-model";

export type DoctorAttribute = {
  id: string;
  dob: string;
  gender: string;
  phone: string;
  qualification: string;
  specialization: string;
  licenseNumber: string;
  address: string;
  profileImage: string;
  certificateImage: string;
  isDeleted?: boolean;
  isApproved?: boolean;
  userId: string;
};

export type DoctorCreationAttribute = Omit<DoctorAttribute, "id">;

export class Doctor
  extends Model<DoctorAttribute, DoctorCreationAttribute>
  implements DoctorAttribute
{
  public id!: string;
  public dob!: string;
  public gender!: string;
  public phone!: string;
  public qualification!: string;
  public specialization!: string;
  public licenseNumber!: string;
  public address!: string;
  public profileImage!: string;
  public certificateImage!: string;
  public isDeleted!: boolean;
  public isApproved!: boolean;
  public userId!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Doctor.hasMany(DoctorShedule, {
      foreignKey: "doctorId",
      as: "DoctorShedule",
    });
    Doctor.belongsTo(User, {
      foreignKey: "userId",
      as: "userAsDoctor",
    });
  }
}

Doctor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "profile_image",
    },
    certificateImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "certificate_image",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_deleted",
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_approved",
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
    tableName: "doctors",
    timestamps: true,
  }
);
