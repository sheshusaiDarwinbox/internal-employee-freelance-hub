import { Schema, model } from "mongoose";
import type { Notification, NotificationModelType } from "../types/notifications.types";

const notificationSchema = new Schema<Notification, NotificationModelType>({
  NID: { type: String, required: true, index: true, unique: true },
  EID: { type: String, required: true },
  description: { type: String, required: true },
  From: { type: String, required: true }
});

export const NotificationModel = model<Notification, NotificationModelType>('Notification', notificationSchema);
