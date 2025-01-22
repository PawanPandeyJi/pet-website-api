import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Message } from "./message.model";

export type RoomAttributes = {
  id: string;
  participant1: string;
  participant2: string;
  appointmentId: string;
};

export type RoomCreationAttribute = Omit<RoomAttributes, "id">;

export class Room
  extends Model<RoomAttributes, RoomCreationAttribute>
  implements RoomAttributes
{
  id!: string;
  participant1!: string;
  participant2!: string;
  appointmentId!: string;

  public readonly createAt!: Date;
  messages?: Message[];

  static associate() {
    Room.hasMany(Message, {
      foreignKey: "roomId",
      sourceKey: "id",
      as: "messages",
    });
  }
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    participant1: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "participant1",
    },
    participant2: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "participant2",
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "appointment_id",
    },
  },
  {
    sequelize,
    tableName: "room",
    timestamps: true,
  },
);
