import { Router } from "express";
import { ChatControlRouter } from "../controllers/chat.controller";

export const chatRouter = Router();

chatRouter.use("/chats", ChatControlRouter);
