import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { Types } from "mongoose";
import {
  CreateUserSchema,
  GetUserSchema,
  UpdateUserSkills,
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
import { GigSchema } from "../types/gig.types"; 
import z, { date } from "zod";
import { UserAuth } from "../types/userAuth.types";
import { client } from "../database/connection";
import { AccountDetailsModel } from "../models/accountDetails.model"; 

interface UserWithRole extends Document {
  role: UserRole;
}

export const createUser = sessionHandler(
  async (req: Request, res: Response, session) => {
    const users = CreateUserSchema.parse(req.body);
    let id; // Initialize id here
    let usersEmailData: {
      EID: string;
      password: string;
      email: string;
      _id?: string;
    }[] = [];

    // console.log(users);
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const { skills, ...data } = user;
        const department = await DepartmentModel.findOne(
          { DID: data.DID },
          null,
          {
            session,
          }
        );
        const position = await PositionModel.findOne({ PID: data.PID }, null, {
          session,
        });

        const findUser = await User.findOne({ email: user.email });

        if (!department || !position || findUser)
          throw new Error(
            "Department or Position not found or email already exists"
          );

        const result = await DepartmentModel.findOneAndUpdate(
          { DID: data.DID },
          { $inc: { teamSize: 1 } },
          { session, new: true }
        );
        if (!result) throw new Error("Department not updated");
        let id = ""; // Initialize id with a default value
      if(data.role === "Other"){
        id = await generateId(IDs.OID, session);
      }
      else{
        id = await generateId(IDs.EID, session);
      }

        const password = generateRandomPassword();
        const hashedPassword = await hashPassword(password);

        if (skills) {
          skills.forEach(({ skill, score }) => {
            const hashKey = `skills:${skill}`;
            if (score && score !== 0) client.hSet(hashKey, id, score);
          });
        }

        usersEmailData.push({
          EID: id,
          password,
          email: user.email,
        });

        return {
          ...data,
          skills: skills,
          verified: false,
          EID: id,
          password: hashedPassword,
          doj: new Date().toISOString().split("T")[0],
        };
      })
    );

    // console.log(updatedUsers);

    const insertedUsers = await User.create(updatedUsers, { session });

    insertedUsers.forEach((user, idx) => {
      sendVerificationEmail({ ...usersEmailData[idx], _id: user._id });
    });

    return res.status(HttpStatusCodes.CREATED).send( { user: insertedUsers as any, accountDetails, resultStatus: HttpStatusCodes.CREATED } ); // Ensure it returns an object with a data property
  }
);

export const updateUserSkills = sessionHandler(
  async (req: Request, res: Response) => {
    const { EID } = req.params;
    const user: UserAuth | null = await User.findOne({ EID: EID });
    if (!user) throw new Error("Bad Request");
    console.log(req.body);
    const { skills } = UpdateUserSkills.parse(req.body);
    console.log(skills);
    if (skills) {
      skills.forEach(async ({ skill, score }) => {
        const hashKey = `skills:${skill}`;
        if (score && score === -1) await client.hDel(hashKey, EID);
        else if (score && score !== 0) await client.hSet(hashKey, EID, score);
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { EID: EID },
      {
        $push: {
          skills: { $each: skills },
        },
      },
      { new: true, upsert: true }
    );
    return {
      status: HttpStatusCodes.OK,
      data: updatedUser,
    };
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
    return user;
  }
);

export const getUserById = sessionHandler(
  async (req: Request, res: Response) => {
    const { ID } = req.params;

    GetUserSchema.parse({ EID: ID });
    const user = (await User.findOne({ EID: ID })) as UserWithRole;
    if (!user) throw new Error("Bad Request");
    return {
      status: HttpStatusCodes.OK,
      data: user,
    };
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
    const user = (await User.findOne({ EID: EID })) as UserWithRole;
    if (!user) throw new Error("User not found");
    return user;
  }
);

export const updateProfile = sessionHandler(
  async (req: Request, res: Response) => {
    const EID = req.user?.EID;
    const user: UserAuth | null = await User.findOne({ EID: EID });
    if (!user) throw new Error("User not found");
    const {
      gender = user.gender,
      phone = user.phone,
      dob = user.dob,
      maritalStatus = user.maritalStatus,
      nationality = user.nationality,
      bloodGroup = user.bloodGroup,
      workmode = user.workmode,
      address = user.address,
      city = user.city,
      state = user.state,
      country = user.country,
      pincode = user.pincode,
      emergencyContactNumber = user.emergencyContactNumber,
      fullName = user.fullName,
    } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { EID: req.user?.EID },
      {
        $set: {
          phone: phone || user.phone,
          gender: gender || user.gender,
          dob: dob || user.dob,
          maritalStatus: maritalStatus || user.maritalStatus,
          nationality: nationality || user.nationality,
          bloodGroup: bloodGroup || user.bloodGroup,
          workmode: workmode || user.workmode,
          address: address || user.address,
          city: city || user.city,
          state: state || user.state,
          country: country || user.country,
          pincode: pincode || user.pincode,
          emergencyContactNumber:
            emergencyContactNumber || user.emergencyContactNumber,
          fullName: fullName || user.fullName,
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

export const getGigsByUser = sessionHandler(
  async (req: Request, res: Response) => {
    const { page = 1, search = "", DIDs, ManagerIDs } = req.query;
    const pageNum = Number(page) - 1;
    const EID = req.user?.EID;
    let filter: any = {};

    const user = (await User.findOne({ EID: EID })) as UserWithRole;
    if (!user) {
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        message: "userNotfound",
      };
    }

    if (DIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
      ).parse(DIDs);
      filter.DID = { $in: DIDs };
    }
    if (ManagerIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
      ).parse(DIDs);
      filter.ManagerID = { $in: ManagerIDs };
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

    let gigs;

    if (user.role === UserRole.Manager) {
      filter.ManagerID = EID;
      gigs = await Gig.paginate(filter, {
        offset: pageNum * 6,
        limit: 6,
      });
    } else if (user.role === UserRole.Employee || UserRole.Other) {
      filter.EID = EID;
      gigs = await Gig.paginate(filter, {
        offset: pageNum * 6,
        limit: 6,
      });
    } else {
      return {
        status: HttpStatusCodes.OK,
        message: "Invalid User role",
      };
    }

    return {
      status: HttpStatusCodes.OK,
      data: gigs,
    };
  }
);

export const resendVerifyMail = sessionHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    z.string().email({ message: "Invalid email" }).parse(email);

    const user: (UserAuth & { _id: Types.ObjectId }) | null =
      await User.findOne({ email: email });
    if (!user)
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          message: "User not found",
        },
      };

    if (user.verified)
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          message: "User already verified",
        },
      };

    const password = generateRandomPassword();
    const hashedPassword = hashPassword(password);
    const updatedUser = User.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    sendVerificationEmail({
      EID: user.EID,
      email: user.email,
      password,
      _id: user._id,
    });

    return {
      status: HttpStatusCodes.OK,
      data: updatedUser,
    };
  }
);

export const getAllEmployees = sessionHandler(
  async (req: Request, res: Response) => {
    const { page = 0 } = req.query;
    const filter: any = {
      role: { $in: [UserRole.Employee, UserRole.Other] }, // Filter for Employee and Other roles
    };
    const pageNum = Number(page);

    const users = await User.paginate(filter, {
      offset: pageNum * 10,
      limit: 10,
    });

    return users;
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
userControlRouter.get(
  "",
  checkAuth([UserRole.Admin, UserRole.Manager]),
  getAllUsers
);
userControlRouter.delete("/:ID", checkAuth([UserRole.Admin]), deleteUserByID);
userControlRouter.get("/emp", checkAuth([]), getAllEmployees);
userControlRouter.get("/get-user/:ID", checkAuth([]), getUserById);
userControlRouter.get("/my-gigs", checkAuth([]), getGigsByUser);
userControlRouter.post("/upload-img", checkAuth([]), uploadProfileImg);
userControlRouter.get("/profile", checkAuth([]), getProfile);
userControlRouter.post("/update-profile", checkAuth([]), updateProfile);
userControlRouter.post(
  "/update-user-skills/:EID",
  checkAuth([UserRole.Admin, UserRole.Manager]),
  updateUserSkills
);
userControlRouter.post("/resend-verify-mail", resendVerifyMail);
userControlRouter.get("/total-rewards/:EID", checkAuth([]), getTotalRewards);
userControlRouter.get("/total-amount/:EID", checkAuth([]), getTotalAmount);
