import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { DepartmentModel } from "../models/department.model";
import {
  assignManagerZodSchema,
  CreateDepartmentSchema,
  DepartmentArraySchema,
  GetDepartmentSchema,
} from "../utils/zod.util";
import { Router } from "express";
import { generateId } from "../utils/counterManager.util";
import { Department } from "../types/department.types";
import { IDs } from "../models/idCounter.model";
import { error } from "../utils/error.util";
import { User } from "../models/userAuth.model";
import { UserAuth } from "../types/userAuth.types";
import { sessionHandler } from "../utils/session.util";

export const createDepartment = sessionHandler(
  async (req: Request, res: Response) => {
    const data = CreateDepartmentSchema.parse(req.body);
    const DID = await generateId(IDs.DID);
    const departmentData: Department = { ...data, DID };
    const department = await DepartmentModel.create(departmentData);
    if (!department) throw new Error("Server Error");
    res.status(201).send(department);
  }
);

export const getAllDepartments = sessionHandler(
  async (req: Request, res: Response) => {
    const { types, page = 0 } = req.query;
    const filter: any = {};
    const pageNum = Number(page);
    if (types) {
      const typesArray = (types as string).split(",");
      DepartmentArraySchema.parse(typesArray);
      filter.type = { $in: typesArray };
    }

    const departments = await DepartmentModel.paginate(filter, {
      offset: pageNum * 10,
      limit: 10,
    });
    res.status(HttpStatusCodes.OK).send(departments);
  }
);

export const deleteDepartmentByID = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetDepartmentSchema.parse({ DID: ID });
    const department = await DepartmentModel.findOne({
      DID: ID,
    });
    if (!department) throw new Error("Bad Request");
    const result = await DepartmentModel.deleteOne({ DID: ID });
    if (result.deletedCount === 0) throw new Error("Department not deleted");
    res.status(HttpStatusCodes.OK).send(department);
  }
);

export const getDepartmentByID = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetDepartmentSchema.parse({ DID: ID });
    const department = await DepartmentModel.findOne({ DID: ID });
    if (!department) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(department);
  }
);

export const assignManagerToDepartment = sessionHandler(
  async (req: Request, res: Response) => {
    const data = assignManagerZodSchema.parse(req.body);
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
    res.status(HttpStatusCodes.OK).send(updatedDepartment);
  }
);

export const departmentControlRouter = Router();

departmentControlRouter.post("/create", createDepartment);
departmentControlRouter.get("", getAllDepartments);
departmentControlRouter.delete("/:ID", deleteDepartmentByID);
departmentControlRouter.get("/:ID", getDepartmentByID);
departmentControlRouter.post("/assign-manager", assignManagerToDepartment);
