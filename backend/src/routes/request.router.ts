import { Router } from "express";
import { requestControlRouter } from "../controllers/request.controller";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserRole } from "../models/userAuth.model";

export const requestRouter = Router();

requestControlRouter.use("/requests", requestControlRouter);
