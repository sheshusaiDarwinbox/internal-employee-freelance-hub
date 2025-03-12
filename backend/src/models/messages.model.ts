import { type PaginateModel, Schema, model } from "mongoose";
import type { Message, MessageModelType } from "../types/messages.types";
import paginate from "mongoose-paginate-v2";

export enum MessageStatus {
  Sent = "Sent",
  Delivered = "Delivered",
  Read = "Read",
}

const messageSchema = new Schema<Message, MessageModelType>({
  MsgID: { type: String, required: true, index: true, unique: true },
  SenderID: { type: String, required: true },
  ReceiverID: { type: String, required: true },
  Content: { type: String, required: true },
  Timestamp: { type: Date, default: Date.now },
  Status: { type: String, required: true, enum: Object.values(MessageStatus) },
});

messageSchema.plugin(paginate);

export const MessageModel = model<Message, PaginateModel<MessageModelType>>(
  "Message",
  messageSchema
);
