import { Router } from "express";

import { positionControlRouter } from "../controllers/position.controller";

export const positionRouter = Router();

positionRouter.use("/positions", positionControlRouter);
