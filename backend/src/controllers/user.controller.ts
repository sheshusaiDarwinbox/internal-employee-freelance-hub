import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import {
  CreateUserSchema,
  GetUserSchema,
  UsersArraySchema,
} from "../utils/zod.util";
import { Router } from "express";
import { User, UserRole } from "../models/userAuth.model";
import { generateId } from "../utils/counterManager.util";
import { DepartmentModel } from "../models/department.model";
import { generateRandomPassword, hashPassword } from "../utils/password.util";
import { IDs } from "../models/idCounter.model";
import { sendVerificationEmail } from "../utils/mail.util";
import { sessionHandler } from "../utils/session.util";
import { PositionModel } from "../models/position.model";
import { parseFile } from "../utils/fileParser.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { generatePresignedUrl } from "../utils/fileParser.util";

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
          doj: new Date().toISOString().split("T")[0],
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
    const { types, page = 1, search = "" } = req.query;
    const filter: any = {};
    const pageNum = Number(page) - 1;
    if (types) {
      const typesArray = (types as string).split(",");
      UsersArraySchema.parse(typesArray);
      filter.role = { $in: typesArray };
    }

    if (search !== "") filter.$text = { $search: search };

    const users = await User.paginate(filter, {
      offset: pageNum * 6,
      limit: 6,
    });
    return {
      status: HttpStatusCodes.OK,
      data: users,
    };
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
    // res.status(HttpStatusCodes.OK).send(user);
    return user;
  }
);

export const getUserById = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;

    GetUserSchema.parse({ EID: ID });
    const user = await User.findOne({ EID: ID });
    if (!user) throw new Error("Bad Request");
    // res.status(HttpStatusCodes.OK).send(user);
    return user;
  }
);

export const uploadProfileImg = sessionHandler(
  async (req: Request, res: Response, session) => {
    const data = await parseFile(req);
    if (!data || !data.fileUrl) throw new Error("failed to upload img");
    const user = await User.findOneAndUpdate(
      {
        EID: req.user?.EID,
      },
      { $set: { img: data.fileUrl } },
      { upsert: true, session }
    );
    if (!user) throw new Error("failed to store file url");
    const url = "https://talent-hive-s3.s3.ap-south-1.amazonaws.com/";
    const presignedUrl = await generatePresignedUrl(
      "talent-hive-s3",
      data.fileUrl.substring(url.length)
    );
    console.log(presignedUrl);
    return {
      message: "Success",
      data: {
        ...data,
        fileUrl: presignedUrl,
      },
    };
  }
);

export const getProfile = sessionHandler(
  async (req: Request, res: Response) => {
    const EID = req.user?.EID;
    const user = await User.findOne({ EID: EID });
    if (!user) throw new Error("User not found");
    return user;
  }
);

export const updateProfile = sessionHandler(
  async (req: Request, res: Response) => {
    const EID = req.user?.EID;
    const user = await User.findOne({ EID: EID });
    if (!user) throw new Error("User not found");
    const {
      gender,
      phone,
      dob,
      maritalStatus,
      nationality,
      bloodGroup,
      workmode,
      address,
      city,
      state,
      country,
      pincode,
      emergencyContactNumber,
      skills,
      fullName,
    } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { EID: req.user?.EID },
      {
        $set: {
          phone: phone,
          gender: gender,
          dob: dob,
          maritalStatus: maritalStatus,
          nationality: nationality,
          bloodGroup: bloodGroup,
          workmode: workmode,
          address: address,
          city: city,
          state: state,
          country: country,
          pincode: pincode,
          emergencyContactNumber: emergencyContactNumber,
          skills: skills,
          fullName: fullName,
        },
      },
      { upsert: true }
    );
    if (!updatedUser) throw new Error("user update failed");
    return {
      data: updatedUser,
    };
  }
);

export const userControlRouter = Router();

userControlRouter.post("/create", checkAuth([UserRole.Admin]), createUser);
userControlRouter.get("", checkAuth([UserRole.Admin]), getAllUsers);
userControlRouter.delete("/:ID", checkAuth([UserRole.Admin]), deleteUserByID);
userControlRouter.get("/:ID", checkAuth([UserRole.Admin]), getUserById);
userControlRouter.post("/upload-img", checkAuth([]), uploadProfileImg);
userControlRouter.get("/profile", checkAuth([]), getProfile);
userControlRouter.post("/update-profile", checkAuth([]), updateProfile);
