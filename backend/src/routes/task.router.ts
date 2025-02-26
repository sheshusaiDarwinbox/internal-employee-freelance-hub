import { Router } from "express";
import { taskControlRouter } from "../controllers/task.controller";

export const taskRouter = Router();

taskRouter.use("/tasks", taskControlRouter);
