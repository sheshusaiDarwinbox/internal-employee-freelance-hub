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
import { Gig } from "../models/gig.model";
import { GigSchema } from "../types/gig.types"; //import the gig schema type
import z from "zod";

interface UserWithRole extends Document {
    role: UserRole;
}

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
    // res.status(HttpStatusCodes.OK).send(users);
    return users;
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
    const user = await User.findOne({ EID: ID }) as UserWithRole;
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
    const user = await User.findOne({ EID: EID }) as UserWithRole;
    if (!user) throw new Error("User not found");
    return user;
  }
);

export const updateProfile = sessionHandler(
  async (req: Request, res: Response) => {
    const EID = req.user?.EID;
    const user = await User.findOne({ EID: EID }) as UserWithRole;
    if (!user) throw new Error("User not found");
    console.log(req.body);
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

export const getGigsByUserID = sessionHandler(
  async (req: Request, res: Response) => {
    const { EID } = req.params;
    const page = Number(req.query.page) || 0;

    // Validate EID
    z.string()
      .regex(/^[a-zA-Z0-9]+$/, { message: "EID must be alphanumeric" })
      .parse(EID);

    // Fetch the user using getUserById
    const user = await User.findOne({ EID: EID }) as UserWithRole;

    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "User not found" });
    }
    
    if (!user.role) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "User role is not defined" });
    }

    const filter: any = {};
    let gigs;

    if (user.role === UserRole.Manager) {
      filter.ManagerID = EID;
      gigs = await Gig.paginate(filter, {
        offset: page * 10,
        limit: 10,
      });

      if (!gigs || gigs.docs.length === 0) {
        return res.status(HttpStatusCodes.OK).send({ message: "No gigs posted" });
      }
    } else if (user.role === UserRole.Employee) {
      filter.EID = EID;
      gigs = await Gig.paginate(filter, {
        offset: page * 10,
        limit: 10,
      });

      if (!gigs || gigs.docs.length === 0) {
        return res.status(HttpStatusCodes.OK).send({ message: "No gigs Assigned" });
      }
    } else {
        return res.status(HttpStatusCodes.BAD_REQUEST).send({message: "Invalid User Role"});
    }

    return res.status(HttpStatusCodes.OK).send(gigs);
  }
);

export const getTotalRewards = sessionHandler(
  async (req: Request, res: Response) => {
    const { EID } = req.params;

    z.string()
      .regex(/^[a-zA-Z0-9]+$/, { message: "EID must be alphanumeric" })
      .parse(EID);

    const gigs = await Gig.find({ EID: EID });

    if (!gigs || gigs.length === 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send({ message: "No gigs found for this user." });
    }

    let totalRewards = 0;
    let gigsWithRewardsCount = 0;

    gigs.forEach((gig) => {
      const gigDoc = gig as unknown as GigSchema;
      if (typeof gigDoc.rewardPoints === "number" && gigDoc.rewardPoints > 0) {
        totalRewards += gigDoc.rewardPoints;
        gigsWithRewardsCount++;
      }
    });

    return res.status(HttpStatusCodes.OK).send({
      totalRewards,
      gigs,
      gigsWithRewardsCount,
    });
  }
);

export const getTotalAmount = sessionHandler(
  async (req: Request, res: Response) => {
    const { EID } = req.params;

    z.string()
      .regex(/^[a-zA-Z0-9]+$/, { message: "EID must be alphanumeric" })
      .parse(EID);

    const gigs = await Gig.find({ EID: EID });

    if (!gigs || gigs.length === 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send({ message: "No gigs found for this user." });
    }

    const totalAmount = gigs.reduce((sum, gig) => {
      const gigDoc = gig as unknown as GigSchema;
      if (typeof gigDoc.amount === "number") {
        return sum + gigDoc.amount;
      }
      return sum;
    }, 0);

    return res.status(HttpStatusCodes.OK).send({
      totalAmount,
      gigs,
    });
  }
);
export const userControlRouter = Router();

userControlRouter.post("/create", checkAuth([UserRole.Admin]), createUser);
userControlRouter.get("", checkAuth([UserRole.Admin]), getAllUsers);
userControlRouter.delete("/:ID", checkAuth([UserRole.Admin]), deleteUserByID);
userControlRouter.get("/:ID", checkAuth([UserRole.Admin]), getUserById);
userControlRouter.get("/gigs/:EID", checkAuth([]), getGigsByUserID);
userControlRouter.post("/upload-img", checkAuth([]), uploadProfileImg);
userControlRouter.get("/profile", checkAuth([]), getProfile);
userControlRouter.post("/update-profile", checkAuth([]), updateProfile);
userControlRouter.get("/total-rewards/:EID", checkAuth([]), getTotalRewards);
userControlRouter.get("/total-amount/:EID", checkAuth([]), getTotalAmount);
