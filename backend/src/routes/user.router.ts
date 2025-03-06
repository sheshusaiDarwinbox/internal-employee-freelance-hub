import { Router } from "express";
import { userControlRouter } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.use("/users", userControlRouter);
