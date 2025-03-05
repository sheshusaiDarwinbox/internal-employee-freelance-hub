import { Router } from "express";
import { userControlRouter } from "../controllers/user.controller";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserRole } from "../models/userAuth.model";

export const userRouter = Router();

userRouter.use("/users", userControlRouter);
