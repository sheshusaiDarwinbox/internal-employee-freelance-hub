import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { JobModel } from "../models/job.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { PostjobSchema } from "../utils/zod.util";
import { Router } from "express";
import { UserRole } from "../models/userAuth.model";
import { generateId, IDMap } from "../utils/counterManager.util";
import { DepartmentModel } from "../models/department.model";
import { Job } from "../types/job.types";

export const createJob = async (req: Request, res: Response) => {
  try {
    const data = PostjobSchema.parse(req.body);
    const Department = await DepartmentModel.findById(data.DID);
    if (!Department) {
      throw new Error("Department not found");
    }
    const JID = await generateId(IDMap.JID);
    const job: Job = await JobModel.create({ ...data, JID });
    res.status(201).json(job);
  } catch (err) {
    if (err instanceof Error) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: err.message });
    } else
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Something went wrong" });
  }
};

export const jobControlRouter = Router();

jobControlRouter.post("/create", checkAuth(UserRole.Admin), createJob);
