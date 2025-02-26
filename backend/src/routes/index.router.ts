import { Router } from "express";

import { departmentRouter } from "./deparment.router";
import { userRouter } from "./user.router";
import { jobRouter } from "./job.router";
import { loginRouter } from "./login.router";
import { verifyRouter } from "./userVerify.router";
import { taskRouter } from "./task.router";

export const indexRouter = Router();

indexRouter.use(departmentRouter);
indexRouter.use(userRouter);
indexRouter.use(jobRouter);
indexRouter.use(loginRouter);
indexRouter.use(verifyRouter);
indexRouter.use(taskRouter);
