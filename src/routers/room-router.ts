import express from "express";
import { authenticateUser } from "../middlewares/token-verification";
import { createRoom, getRooms } from "../controllers/room-controller";

const roomRouter = express.Router();

roomRouter.route("/rooms").get(authenticateUser("*"), getRooms);
roomRouter.route("/rooms").post(authenticateUser("*"), createRoom);

export default roomRouter;
