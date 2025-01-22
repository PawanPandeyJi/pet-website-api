import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import { Room } from "./room.model";

export type MessageAttributes = {
  id: string;
  senderId: string;
  message: string;
  roomId: string;
};

export type MessageCreationAttribute = Omit<MessageAttributes, "id">;

export class Message
  extends Model<MessageAttributes, MessageCreationAttribute>
  implements MessageAttributes
{
  id!: string;
  senderId!: string;
  message!: string;
  roomId!: string;

  public readonly createAt!: Date;

  static associate() {
    Message.belongsTo(Room, {
      foreignKey: "roomId",
      targetKey: "id",
      as: "room",
    });
  }
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "sender_id",
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "room_id",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "message",
    },
  },
  {
    sequelize,
    tableName: "message",
    timestamps: true,
  },
);
