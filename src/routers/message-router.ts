import express from "express";
import { authenticateUser } from "../middlewares/token-verification";
import { createMessage, getMessages } from "../controllers/message-controller";

const messageRouter = express.Router();

messageRouter
  .route("/rooms/:roomId/messages")
  .post(authenticateUser("*"), createMessage);

messageRouter
  .route("/rooms/:roomId/messages")
  .get(authenticateUser("*"), getMessages);

export default messageRouter;
