import { PaginateModel, Schema, model } from "mongoose";
import type {
  Notification,
  NotificationModelType,
} from "../types/notification.types";
import paginate from "mongoose-paginate-v2";

export const notificationSchema = new Schema<
  Notification,
  NotificationModelType
>({
  NID: { type: String, required: true, index: true, unique: true },
  EID: { type: String, required: true },
  description: { type: String, required: true },
  From: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.plugin(paginate);

export const NotificationModel = model<
  Notification,
  PaginateModel<NotificationModelType>
>("Notification", notificationSchema);
