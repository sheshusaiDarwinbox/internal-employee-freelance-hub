import { Router } from "express";

import { notificationControllRouter } from "../controllers/notifications.controller";

export const notificationRouter = Router();
notificationRouter.use("/notifications", notificationControllRouter);
