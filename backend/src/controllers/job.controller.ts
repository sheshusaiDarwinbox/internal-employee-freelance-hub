import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { JobModel } from "../models/job.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import {
  CreateJobSchema,
  GetJobSchema,
  JobsArraySchema,
} from "../utils/zod.util";
import { Router } from "express";
import { UserRole } from "../models/userAuth.model";
import { generateId } from "../utils/counterManager.util";
import { DepartmentModel } from "../models/department.model";
import { IDs } from "../models/idCounter.model";
import { error } from "../utils/error.util";
import { sessionHandler } from "../utils/session.util";

export const createJob = sessionHandler(async (req: Request, res: Response) => {
  const data = CreateJobSchema.parse(req.body);
  const Department = await DepartmentModel.findOne({ DID: data.DID });
  if (!Department) {
    throw new Error("Department not found");
  }
  const JID = await generateId(IDs.JID);
  const job = await JobModel.create({ ...data, JID });
  if (!job) throw new Error("Job not created");
  res.status(201).json(job);
});

export const getAllJobs = sessionHandler(
  async (req: Request, res: Response) => {
    const { types, page = 0 } = req.query;
    const filter: any = {};
    const pageNum = Number(page);

    if (types) {
      const typesArray = (types as string).split(",");
      JobsArraySchema.parse(typesArray);
      filter.type = { $in: typesArray };
    }

    const jobs = await JobModel.paginate(filter, {
      offset: pageNum * 10,
      limit: 10,
    });
    res.status(HttpStatusCodes.OK).send(jobs);
  }
);

export const deleteJobByID = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetJobSchema.parse({ JID: ID });
    const job = await JobModel.findOne({
      JID: ID,
    });
    if (!job) throw new Error("Bad Request");
    const result = await JobModel.deleteOne({ JID: ID });
    if (result.acknowledged === false) throw new Error("Job not deleted");
    res.status(HttpStatusCodes.OK).send(job);
  }
);

export const getJobById = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetJobSchema.parse({ JID: ID });
    const job = await JobModel.findOne({ JID: ID });
    if (!job) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(job);
  }
);

export const jobControlRouter = Router();

jobControlRouter.post("/create", checkAuth([UserRole.Admin]), createJob);
jobControlRouter.get("", getAllJobs);
jobControlRouter.delete("/:ID", deleteJobByID);
jobControlRouter.get("/:ID", getJobById);
