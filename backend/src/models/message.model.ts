import { Schema, model } from "mongoose";
import type { Message, MessageModelType } from "../types/message.types";

const messageSchema = new Schema<Message, MessageModelType>({
  SenderID: { type: String, required: true },
  ReceiverID: { type: String, required: true },
  Content: { type: String, required: true },
  Timestamp: { type: Date, default: Date.now },
});

export const MessageModel = model<Message, MessageModelType>(
  "Message",
  messageSchema
);
