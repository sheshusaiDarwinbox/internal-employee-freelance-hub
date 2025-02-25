import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { DepartmentModel } from "../models/department.model";
import {
  CreateDepartmentSchema,
  DepartmentArraySchema,
  GetDepartmentSchema,
} from "../utils/zod.util";
import { Router } from "express";
import { generateId } from "../utils/counterManager.util";
import { Department } from "../types/department.types";
import { IDs } from "../models/idCounter.model";
import { error } from "../utils/error.util";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const data = CreateDepartmentSchema.parse(req.body);
    const DID = await generateId(IDs.DID);
    const departmentData: Department = { ...data, DID };
    const department = await DepartmentModel.create(departmentData);
    if (!department) throw new Error("Server Error");
    res.status(201).send(department);
  } catch (err) {
    error(err, res);
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    error(err, res);
  }
};

export const deleteDepartmentByID = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;
    GetDepartmentSchema.parse({ DID: ID });
    const department = await DepartmentModel.findOne({
      DID: ID,
    });
    if (!department) throw new Error("Bad Request");
    const result = await DepartmentModel.deleteOne({ DID: ID });
    if (result.deletedCount === 0) throw new Error("Department not deleted");
    res.status(HttpStatusCodes.OK).send(department);
  } catch (err) {
    error(err, res);
  }
};

export const getDepartmentByID = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;
    GetDepartmentSchema.parse({ DID: ID });
    const department = await DepartmentModel.findOne({ DID: ID });
    if (!department) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(department);
  } catch (err) {
    error(err, res);
  }
};
export const departmentControlRouter = Router();

departmentControlRouter.post("/create", createDepartment);
departmentControlRouter.get("", getAllDepartments);
departmentControlRouter.delete("/:ID", deleteDepartmentByID);
departmentControlRouter.get("/:ID", getDepartmentByID);
