import { PaginateModel, Schema, model } from "mongoose";
import type {
  Notification,
  NotificationModelType,
} from "../types/notification.types";
import paginate from "mongoose-paginate-v2";

const notificationSchema = new Schema<Notification, NotificationModelType>({
  NID: { type: String, required: true, index: true, unique: true },
  EID: { type: String, required: true },
  description: { type: String, required: true },
  From: { type: String, required: true },
});

notificationSchema.plugin(paginate);

export const NotificationModel = model<
  Notification,
  PaginateModel<NotificationModelType>
>("Notification", notificationSchema);
