import { Router } from "express";
import { gigControlRouter } from "../controllers/gig.controller";

export const gigRouter = Router();

gigRouter.use("/gigs", gigControlRouter);
