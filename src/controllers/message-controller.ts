import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { Op } from "sequelize";
import { Message } from "../models/message.model";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const room = await Room.findOne({
      where: {
        id: roomId,
        [Op.or]: [{ participant1: userId }, { participant2: userId }],
      },
      include: [
        {
          model: Message,
          as: "messages",
        },
      ],
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.status(200).json(room.messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
    console.log(error);
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const room = await Room.findOne({
      where: {
        id: roomId,
        [Op.or]: [{ participant1: userId }, { participant2: userId }],
      },
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    const message = await Message.create({
      message: req.body.message,
      roomId: roomId,
      senderId: userId,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error });
    console.log(error);
  }
};
