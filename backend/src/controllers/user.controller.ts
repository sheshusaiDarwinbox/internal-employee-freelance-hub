import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { JobModel } from "../models/job.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { PostUserSchema } from "../utils/zod.util";
import { Router } from "express";
import { User, UserRole } from "../models/userAuth.model";
import { generateId, IDMap } from "../utils/counterManager.util";
import { DepartmentModel } from "../models/department.model";
import { generateRandomPassword, hashPassword } from "../utils/password.util";

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = PostUserSchema.parse(req.body);
    const department = await DepartmentModel.findById(data.DID);
    if (!department) {
      throw new Error("Department not found");
    }
    const job = await JobModel.findById(data.JID);
    if (!job) {
      throw new Error("Job not found");
    }
    const id = await generateId(IDMap.EID);
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);
    await User.create({ ...data, EID: id, password: hashedPassword });
    res.status(HttpStatusCodes.CREATED).json({ id, password });
  } catch (err) {
    if (err instanceof Error) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: err.message });
    } else
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Something went wrong" });
  }
};

export const userControlRouter = Router();

userControlRouter.post("/create", checkAuth(UserRole.Admin), createUser);
