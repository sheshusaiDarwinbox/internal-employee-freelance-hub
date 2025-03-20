import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { DepartmentModel } from "../models/department.model";
import {
  AssignManagerZodSchema,
  CreateDepartmentSchema,
  DepartmentArraySchema,
  GetDepartmentSchema,
} from "../utils/zod.util";
import { Router } from "express";
import { generateId } from "../utils/counterManager.util";
import { Department, DepartmentModelType } from "../types/department.types";
import { IDs } from "../models/idCounter.model";
import { User, UserRole } from "../models/userAuth.model";
import { UserAuth } from "../types/userAuth.types";
import { sessionHandler } from "../utils/session.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { FilterQuery } from "mongoose";

export const createDepartment = sessionHandler(
  async (req: Request, _res: Response, session) => {
    console.log(req.body);
    req.body.teamSize = parseInt(req.body.teamSize);
    const data = CreateDepartmentSchema.parse(req.body);
    const DID = await generateId(IDs.DID, session);
    const departmentData: Department = { ...data, DID };
    const department = await DepartmentModel.create(departmentData);
    if (!department) throw new Error("Server Error");
    return {
      status: HttpStatusCodes.OK,
      data: department,
    };
  }
);

export const getAllDepartments = sessionHandler(async (req: Request) => {
  const { functions, page = 1, search = "" } = req.query;
  const filter: FilterQuery<DepartmentModelType> = {};
  const pageNum = Number(page) - 1;
  if (functions) {
    const functionsArray = (functions as string).split(",");
    DepartmentArraySchema.parse(functionsArray);
    filter.type = { $in: functionsArray };
  }

  if (search !== "") {
    filter.$text = { $search: search as string };
  }

  const departments = await DepartmentModel.paginate(filter, {
    offset: pageNum * 6,
    limit: 6,
  });
  return { status: HttpStatusCodes.OK, data: departments };
});

export const deleteDepartmentByID = sessionHandler(async (req: Request) => {
  const { ID } = req.params;
  GetDepartmentSchema.parse({ DID: ID });
  const department = await DepartmentModel.findOne({
    DID: ID,
  });
  if (!department) throw new Error("Bad Request");
  const result = await DepartmentModel.deleteOne({ DID: ID });
  if (result.deletedCount === 0) throw new Error("Department not deleted");
  return {
    status: HttpStatusCodes.OK,
    data: department,
  };
});

export const getDepartmentByID = sessionHandler(async (req: Request) => {
  const { ID } = req.params;
  GetDepartmentSchema.parse({ DID: ID });
  const department = await DepartmentModel.findOne({ DID: ID });
  if (!department) throw new Error("Bad Request");
  return {
    status: HttpStatusCodes.OK,
    data: department,
  };
});

export const assignManagerToDepartment = sessionHandler(
  async (req: Request) => {
    const data = AssignManagerZodSchema.parse(req.body);
    const user: UserAuth | null = await User.findOne({ EID: data.EID });
    const department: Department | null = await DepartmentModel.findOne({
      DID: data.DID,
    });
    if (
      !user ||
      !department ||
      department.ManagerID !== undefined ||
      user.DID !== department.DID
    )
      throw new Error(
        "user or department not found OR department already assigned with a manager OR user does not belong to given Department"
      );

    const updatedDepartment = await DepartmentModel.updateOne(
      { DID: data.DID },
      {
        $set: {
          ManagerID: data.EID,
        },
      }
    );

    if (!updatedDepartment) throw new Error("failed to assign manager");
    return {
      status: HttpStatusCodes.OK,
      data: updatedDepartment,
    };
  }
);

export const departmentControlRouter = Router();

departmentControlRouter.post(
  "/create",
  checkAuth([UserRole.Admin]),
  createDepartment
);
departmentControlRouter.get("", checkAuth([]), getAllDepartments);
departmentControlRouter.delete(
  "/:ID",
  checkAuth([UserRole.Admin]),
  deleteDepartmentByID
);
departmentControlRouter.get("/:ID", checkAuth([]), getDepartmentByID);
departmentControlRouter.post(
  "/assign-manager",
  checkAuth([UserRole.Admin]),
  assignManagerToDepartment
);