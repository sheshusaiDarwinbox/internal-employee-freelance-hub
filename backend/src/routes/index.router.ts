import { Router } from "express";

import { departmentRouter } from "./deparment.router";
import { userRouter } from "./user.router";
import { loginRouter } from "./login.router";
import { verifyRouter } from "./userVerify.router";
import { gigRouter } from "./gig.router";
import { positionRouter } from "./position.router";

export const indexRouter = Router();

indexRouter.use(departmentRouter);
indexRouter.use(userRouter);
indexRouter.use(positionRouter);
indexRouter.use(loginRouter);
indexRouter.use(verifyRouter);
indexRouter.use(gigRouter);
