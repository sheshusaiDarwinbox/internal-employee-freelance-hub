import { Router } from "express";
import { accountDetailsControlRouter } from "../controllers/accountDetails.controller";

export const accountDetailsRouter = Router();

accountDetailsRouter.use("/accounts", accountDetailsControlRouter);
