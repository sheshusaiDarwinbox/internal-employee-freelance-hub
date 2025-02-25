import { Router } from "express";
import { departmentControlRouter } from "../controllers/department.controller";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserRole } from "../models/userAuth.model";

export const departmentRouter = Router();

departmentRouter.use(
  "/departments",
  checkAuth([UserRole.Admin]),
  departmentControlRouter
);
