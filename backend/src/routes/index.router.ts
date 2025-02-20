import { Router } from "express";

import { departmentRouter } from "./deparment.router";
import { userRouter } from "./user.router";
import { jobRouter } from "./job.router";

export const indexRouter = Router();

indexRouter.use("/api", departmentRouter);
