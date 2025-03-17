import { Router } from "express";
import { sessionHandler } from "../utils/session.util";
import { MessageModel } from "../models/message.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";

export const messageControlRouter = Router();

messageControlRouter.get(
  "/:senderID/:receiverID",
  sessionHandler(async (req, res, session) => {
    const { senderID, receiverID } = req.params;
    console.log(senderID, receiverID);
    const messages = await MessageModel.find({
      SenderID: senderID,
      ReceiverID: receiverID,
    });
    console.log(messages);
    return {
      status: HttpStatusCodes.OK,
      data: messages,
    };
  })
);
