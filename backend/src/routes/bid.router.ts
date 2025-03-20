import { Router } from "express";
import { bidControlRouter } from "../controllers/bid.controller";

export const bidRouter = Router();

bidRouter.use("/bids", bidControlRouter);
