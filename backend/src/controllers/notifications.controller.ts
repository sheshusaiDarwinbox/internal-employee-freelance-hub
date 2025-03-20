import { Router } from "express";
import { sessionHandler } from "../utils/session.util";
import { NotificationModel } from "../models/notification.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { Notification } from "../types/notification.types";

export const notificationControllRouter = Router();

export const getNotifications = sessionHandler(async (req) => {
  const EID = req?.user?.EID;
  const { page = 1 } = req.query;

  let pageNum = Number(page) - 1;
  if (pageNum < 0) pageNum = 0;
  const notifications = await NotificationModel.paginate(
    { EID: EID, read: false },
    {
      offset: pageNum * 6,
      limit: 6,
      sort: { createdAt: -1 },
    }
  );

  if (!notifications)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "No notifications found",
      },
    };
  return {
    status: HttpStatusCodes.OK,
    data: notifications,
  };
});

export const markAsRead = sessionHandler(async (req) => {
  const { NID } = req.body;
  const notification: Notification | null = await NotificationModel.findOne({
    NID: NID,
  });
  if (!notification || notification.read)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "Notification not found OR already read",
      },
    };
  const updatedNotification = await NotificationModel.findOneAndUpdate(
    { NID: NID },
    {
      $set: {
        read: true,
      },
    }
  );
  if (!updatedNotification)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "Failed to mark notification as read",
      },
    };
  return {
    status: HttpStatusCodes.OK,
    data: {
      msg: "Notification marked as read",
    },
  };
});

notificationControllRouter.get("/getNotifications", getNotifications);
notificationControllRouter.post("/markAsRead", markAsRead);