import { Router } from "express";
import { userVerifyController } from "../controllers/userVerify.controller";

export const verifyRouter = Router();

verifyRouter.use(userVerifyController);
