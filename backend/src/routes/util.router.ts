import { Router } from "express";
import { utilControlRouter } from "../controllers/util.controller";

export const utilRouter = Router();

utilRouter.use("/util", utilControlRouter);
