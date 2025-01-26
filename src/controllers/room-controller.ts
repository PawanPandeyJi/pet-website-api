import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { Op } from "sequelize";
import { socketIo } from "../index";

export const getRooms = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json(
      await Room.findAll({
        where: {
          [Op.or]: [
            {
              participant1: req.user.id,
            },
            {
              participant2: req.user.id,
            },
          ],
        },
      })
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoom = async (
  req: Request<Record<string, string>, { participant: string; appointmentId: string }>,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const roomWithSameParticipants = await Room.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ participant1: req.user.id }, { participant1: req.body.participant }],
          },
          {
            [Op.or]: [{ participant2: req.user.id }, { participant2: req.body.participant }],
          },
          {
            appointmentId: req.body.appointmentId,
          },
        ],
      },
    });
    if (roomWithSameParticipants) {
      res.status(409).json({ message: "Room already exists" });
      return;
    }
    const room = await Room.create({
      participant1: req.user.id,
      participant2: req.body.participant,
      appointmentId: req.body.appointmentId,
    });

    if (room) {
      socketIo.emit("askToJoin", {});
    } else {
      res.status(500).json({ message: "Failed to create room" });
      return;
    }

    res.status(201).json(room);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
