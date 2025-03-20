import { Router } from "express";
import { sessionHandler } from "../utils/session.util";
import { MessageModel } from "../models/message.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";

export const messageControlRouter = Router();

messageControlRouter.get(
  "/:senderID/:receiverID",
  sessionHandler(async (req) => {
    const { senderID, receiverID } = req.params;
    const messages = await MessageModel.find({
      SenderID: senderID,
      ReceiverID: receiverID,
    });
    return {
      status: HttpStatusCodes.OK,
      data: messages,
    };
  })
);