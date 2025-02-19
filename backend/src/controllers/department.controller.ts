import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { DepartmentModel } from "../models/department.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { DepartmentSchema } from "../utils/zod.util";
import { Router } from "express";
import { UserRole } from "../types/userAuth.types";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    DepartmentSchema.parse(req.body);
    const department = await DepartmentModel.create(req.body);
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

const router = Router();

router.post("/create", checkAuth(UserRole.Admin), createDepartment);
