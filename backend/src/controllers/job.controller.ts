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

export const createJob = async (req: Request, res: Response) => {
  try {
    const data = CreateJobSchema.parse(req.body);
    const Department = await DepartmentModel.findOne({ DID: data.DID });
    if (!Department) {
      throw new Error("Department not found");
    }
    const JID = await generateId(IDs.JID);
    const job = await JobModel.create({ ...data, JID });
    if (!job) throw new Error("Job not created");
    res.status(201).json(job);
  } catch (err) {
    error(err, res);
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    error(err, res);
  }
};

export const deleteJobByID = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;
    GetJobSchema.parse({ JID: ID });
    const job = await JobModel.findOne({
      JID: ID,
    });
    if (!job) throw new Error("Bad Request");
    const result = await JobModel.deleteOne({ JID: ID });
    if (result.acknowledged === false) throw new Error("Job not deleted");
    res.status(HttpStatusCodes.OK).send(job);
  } catch (err) {
    error(err, res);
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;
    GetJobSchema.parse({ JID: ID });
    const job = await JobModel.findOne({ JID: ID });
    if (!job) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(job);
  } catch (err) {
    error(err, res);
  }
};

export const jobControlRouter = Router();

jobControlRouter.post("/create", checkAuth([UserRole.Admin]), createJob);
jobControlRouter.get("", getAllJobs);
jobControlRouter.delete("/:ID", deleteJobByID);
jobControlRouter.get("/:ID", getJobById);
