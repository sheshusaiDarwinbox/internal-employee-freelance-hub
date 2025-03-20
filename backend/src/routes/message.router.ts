import { Router } from "express";
import { messageControlRouter } from "../controllers/message.controller";

export const messageRouter = Router();

messageRouter.use("/messages", messageControlRouter);
