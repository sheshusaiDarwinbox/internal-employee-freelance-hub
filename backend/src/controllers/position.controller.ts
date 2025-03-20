import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { PositionModel } from "../models/position.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import {
  GetPositionSchema,
  PositionsArraySchema,
  CreatePositionSchema,
} from "../utils/zod.util";
import { Router } from "express";
import { UserRole } from "../models/userAuth.model";
import { generateId } from "../utils/counterManager.util";
import { DepartmentModel } from "../models/department.model";
import { IDs } from "../models/idCounter.model";
import { sessionHandler } from "../utils/session.util";
import z from "zod";
import { FilterQuery } from "mongoose";
import { PositionModelType } from "../types/position.types";

export const createPosition = sessionHandler(
  async (req: Request, _res: Response, session) => {
    if (req.body.salary) req.body.salary = parseInt(req.body.salary);
    const data = CreatePositionSchema.parse(req.body);
    const Department = await DepartmentModel.findOne({ DID: data.DID });
    if (!Department) {
      throw new Error("Department not found");
    }
    const PID = await generateId(IDs.PID, session);
    const position = await PositionModel.create({ ...data, PID });
    if (!position) throw new Error("Position not created");
    return {
      status: HttpStatusCodes.CREATED,
      data: position,
    };
  }
);

export const getAllPositions = sessionHandler(async (req: Request) => {
  const { types, page = 1, DIDs, search } = req.query;
  let filter: FilterQuery<PositionModelType> = {};
  const pageNum = Number(page) - 1;

  if (types) {
    const typesArray = (types as string).split(",");
    PositionsArraySchema.parse(typesArray);
    filter.type = { $in: typesArray };
  }
  if (DIDs) {
    z.array(
      z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
    ).parse(DIDs);
    filter.DID = { $in: DIDs };
  }

  if (search) {
    z.string().regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "search must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    );
    filter = {
      ...filter,
      $text: { $search: search as string },
    };
  }

  const positions = await PositionModel.aggregate([
    { $match: filter },
    { $skip: pageNum * 6 },
    { $limit: 6 },
    {
      $lookup: {
        from: "departments",
        localField: "DID",
        foreignField: "DID",
        as: "department",
      },
    },
    {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        PID: 1,
        title: 1,
        description: 1,
        type: 1,
        DID: 1,
        salary: 1,
        "department.name": 1,
        "department.function": 1,
        "department.teamSize": 1,
      },
    },
  ]);

  const total = await PositionModel.countDocuments(filter);

  return {
    status: HttpStatusCodes.OK,
    data: {
      docs: positions,
      totalDocs: total,
      limit: 6,
      page: pageNum + 1,
      totalPages: Math.ceil(total / 6),
      hasNextPage: (pageNum + 1) * 6 < total,
      nextPage: (pageNum + 1) * 6 < total ? pageNum + 2 : null,
      hasPrevPage: pageNum > 0,
      prevPage: pageNum > 0 ? pageNum : null,
    },
  };
});

export const deletePositionByID = sessionHandler(async (req: Request) => {
  const { ID } = req.params;
  GetPositionSchema.parse({ PID: ID });
  const position = await PositionModel.findOne({
    PID: ID,
  });
  if (!position) throw new Error("Bad Request");
  const result = await PositionModel.deleteOne({ PID: ID });
  if (result.acknowledged === false) throw new Error("position not deleted");
  return {
    status: HttpStatusCodes.OK,
    data: position,
  };
});

export const getPositionById = sessionHandler(async (req: Request) => {
  const { ID } = req.params;
  GetPositionSchema.parse({ PID: ID });
  const position = await PositionModel.findOne({ PID: ID });
  if (!position) throw new Error("Bad Request");
  return {
    status: HttpStatusCodes.OK,
    data: position,
  };
});

export const positionControlRouter = Router();

positionControlRouter.post(
  "/create",
  checkAuth([UserRole.Admin]),
  createPosition
);
positionControlRouter.get("", checkAuth([]), getAllPositions);
positionControlRouter.delete(
  "/:ID",
  checkAuth([UserRole.Admin]),
  deletePositionByID
);
positionControlRouter.get("/:ID", checkAuth([]), getPositionById);