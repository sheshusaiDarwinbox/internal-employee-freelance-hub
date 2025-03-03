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

export const createPosition = sessionHandler(
  async (req: Request, res: Response, session) => {
    const data = CreatePositionSchema.parse(req.body);
    const Department = await DepartmentModel.findOne({ DID: data.DID });
    if (!Department) {
      throw new Error("Department not found");
    }
    const PID = await generateId(IDs.PID, session);
    const position = await PositionModel.create({ ...data, PID });
    if (!position) throw new Error("Position not created");
    res.status(201).json(position);
  }
);

export const getAllPositions = sessionHandler(
  async (req: Request, res: Response) => {
    const { types, page = 0, DIDs, search } = req.query;
    let filter: any = {};
    const pageNum = Number(page);

    if (types) {
      const typesArray = (types as string).split(",");
      PositionsArraySchema.parse(typesArray);
      filter.type = { $in: typesArray };
    }
    if (DIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
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
        $text: { $search: search },
      };
    }
    const positions = await PositionModel.paginate(filter, {
      offset: pageNum * 10,
      limit: 10,
    });
    res.status(HttpStatusCodes.OK).send(positions);
  }
);

export const deletePositionByID = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetPositionSchema.parse({ PID: ID });
    const position = await PositionModel.findOne({
      PID: ID,
    });
    if (!position) throw new Error("Bad Request");
    const result = await PositionModel.deleteOne({ PID: ID });
    if (result.acknowledged === false) throw new Error("position not deleted");
    res.status(HttpStatusCodes.OK).send(position);
  }
);

export const getPositionById = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetPositionSchema.parse({ PID: ID });
    const position = await PositionModel.findOne({ PID: ID });
    if (!position) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(position);
  }
);

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
