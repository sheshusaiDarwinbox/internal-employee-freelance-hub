import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { DepartmentModel } from "../models/department.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { PostDepartmentSchema } from "../utils/zod.util";
import { Router } from "express";
import { UserRole } from "../models/userAuth.model";
import { generateId, IDMap } from "../utils/counterManager.util";
import { Department } from "../types/department.types";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const data = PostDepartmentSchema.parse(req.body);
    const DID = await generateId(IDMap.DID);
    const departmentData: Department = { ...data, DID };
    const department = await DepartmentModel.create(departmentData);
    res.status(201).json(department);
  } catch (err) {
    if (err instanceof Error) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: err.message });
    } else
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Something went wrong" });
  }
};

export const departmentControlRouter = Router();

departmentControlRouter.post(
  "/create",
  checkAuth(UserRole.Admin),
  createDepartment
);
