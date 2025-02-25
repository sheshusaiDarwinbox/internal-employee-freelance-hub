import { Router } from "express";
import { loginControlRouter } from "../controllers/login.controller";

export const loginRouter = Router();

loginRouter.use("/auth", loginControlRouter);
