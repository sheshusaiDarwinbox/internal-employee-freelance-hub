import { Router } from "express";
import { departmentControlRouter } from "../controllers/department.controller";

export const departmentRouter = Router();

departmentRouter.use("/departments", departmentControlRouter);
