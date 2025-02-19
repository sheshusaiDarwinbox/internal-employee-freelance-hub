import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { DepartmentModel } from "../models/department.model";
import { checkAuth } from "../middleware/checkAuth.middleware";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await DepartmentModel.create(req.body);
    return res.status(201).json(department);
  } catch (err) {
    if (err instanceof Error) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: err.message });
    } else
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Something went wrong" });
  }
};
