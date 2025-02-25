import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { JobModel } from "../models/job.model";
import {
  CreateUserSchema,
  GetUserSchema,
  UsersArraySchema,
} from "../utils/zod.util";
import { Router } from "express";
import { User } from "../models/userAuth.model";
import { generateId } from "../utils/counterManager.util";
import { DepartmentModel } from "../models/department.model";
import { generateRandomPassword, hashPassword } from "../utils/password.util";
import { IDs } from "../models/idCounter.model";
import { error } from "../utils/error.util";
import { sendVerificationEmail } from "../utils/mail.util";

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.parse(req.body);
    const department = await DepartmentModel.findOne({ DID: data.DID });
    if (!department) {
      throw new Error("Department not found");
    }
    const job = await JobModel.findOne({ JID: data.JID });
    if (!job) {
      throw new Error("Job not found");
    }
    const id = await generateId(IDs.EID);
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      ...data,
      verified: false,
      EID: id,
      password: hashedPassword,
      doj: Date.now(),
    });
    const result = await DepartmentModel.findOneAndUpdate(
      { DID: data.DID },
      { $inc: { teamSize: 1 } }
    );
    if (!result) throw new Error("Department not updated");
    sendVerificationEmail(
      { EID: id, _id: user._id, password, email: data.email },
      "http://localhost:3000",
      res
    );
  } catch (err) {
    error(err, res);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { types, page = 0 } = req.query;
    const filter: any = {};
    const pageNum = Number(page);
    if (types) {
      const typesArray = (types as string).split(",");
      UsersArraySchema.parse(typesArray);
      filter.role = { $in: typesArray };
    }

    const users = await User.paginate(filter, {
      offset: pageNum * 10,
      limit: 10,
    });
    res.status(HttpStatusCodes.OK).send(users);
  } catch (err) {
    error(err, res);
  }
};

export const deleteUserByID = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;
    GetUserSchema.parse({ EID: ID });
    const user = await User.findOne({ EID: ID });
    if (!user) throw new Error("Bad Request");
    const result = await User.deleteOne({ EID: ID });
    if (result.acknowledged === false) throw new Error("User Not Deleted");
    res.status(HttpStatusCodes.OK).send(user);
  } catch (err) {
    error(err, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { ID } = req.params;
    GetUserSchema.parse({ EID: ID });
    const user = await User.findOne({ EID: ID });
    if (!user) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(user);
  } catch (err) {
    error(err, res);
  }
};

export const userControlRouter = Router();

userControlRouter.post("/create", createUser);
userControlRouter.get("", getAllUsers);
userControlRouter.delete("/:ID", deleteUserByID);
userControlRouter.get("/:ID", getUserById);
