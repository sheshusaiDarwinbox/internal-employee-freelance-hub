import type { Model } from "mongoose";

export interface Notification {
  NID: string;
  EID: string;
  description: string;
  From: string;
}

export type NotificationModelType = Model<Notification>;
