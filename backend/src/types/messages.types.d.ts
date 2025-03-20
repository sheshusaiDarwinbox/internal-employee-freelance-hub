import type { Model } from "mongoose";
import { MessageStatus } from "../models/messages.model"; // Ensure MessageStatus is imported

export interface Message {
  MsgID: string;
  SenderID: string;
  ReceiverID: string;
  Content: string;
  Timestamp: Date;
  Status: keyof typeof MessageStatus;
}

export type MessageModelType = Model<Message>;