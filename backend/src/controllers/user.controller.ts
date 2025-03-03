import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
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
import { sendVerificationEmail } from "../utils/mail.util";
import { sessionHandler } from "../utils/session.util";
import { PositionModel } from "../models/position.model";

export const createUser = sessionHandler(
  async (req: Request, res: Response, session) => {
    const data = CreateUserSchema.parse(req.body);

    const department = await DepartmentModel.findOne({ DID: data.DID }, null, {
      session,
    });
    const position = await PositionModel.findOne({ PID: data.PID }, null, {
      session,
    });

    if (!department || !position)
      throw new Error("Department or Position not found");

    const id = await generateId(IDs.EID, session);
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);
    const [user] = await User.create(
      [
        {
          ...data,
          verified: false,
          EID: id,
          password: hashedPassword,
          doj: new Date(),
        },
      ],
      { session }
    );
    const result = await DepartmentModel.findOneAndUpdate(
      { DID: data.DID },
      { $inc: { teamSize: 1 } },
      { session, new: true }
    );
    if (!result) throw new Error("Department not updated");
    const resultStatus = await sendVerificationEmail(
      { EID: id, _id: user._id, password, email: data.email },
      session
    );
    return resultStatus;
  }
);

export const getAllUsers = sessionHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const deleteUserByID = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;
    GetUserSchema.parse({ EID: ID });
    const user = await User.findOne({ EID: ID });
    if (!user) throw new Error("Bad Request");
    const result = await User.deleteOne({ EID: ID });
    if (result.acknowledged === false) throw new Error("User Not Deleted");
    res.status(HttpStatusCodes.OK).send(user);
  }
);

export const getUserById = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;

    console.log(ID);
    GetUserSchema.parse({ EID: ID });
    const user = await User.findOne({ EID: ID });
    if (!user) throw new Error("Bad Request");
    res.status(HttpStatusCodes.OK).send(user);
  }
);

export const userControlRouter = Router();

userControlRouter.post("/create", createUser);
userControlRouter.get("", getAllUsers);
userControlRouter.delete("/:ID", deleteUserByID);
userControlRouter.get("/:ID", getUserById);
