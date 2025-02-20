import { Router } from "express";

import { jobControlRouter } from "../controllers/job.controller";

export const jobRouter = Router();

jobRouter.use("/jobs", jobControlRouter);
