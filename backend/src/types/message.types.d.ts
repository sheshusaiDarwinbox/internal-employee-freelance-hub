import type { Model } from "mongoose";

export interface Message {
  SenderID: string;
  ReceiverID: string;
  Content: string;
  Timestamp: Date;
}

export type MessageModelType = Model<Message>;
