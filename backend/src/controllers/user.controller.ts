import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { FilterQuery, Types } from "mongoose";
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
import z from "zod";
import { UserAuth, UserAuthModel } from "../types/userAuth.types";
import { client } from "../database/connection";
import { ClientSession } from "mongoose";

interface UserWithRole extends Document {
  role: UserRole;
}

export const createUser = async (
  req: Request,
  res: Response,
  session: ClientSession
) => {
  const users = CreateUserSchema.parse(req.body);
  const usersEmailData: {
    EID: string;
    password: string;
    email: string;
    _id?: string;
  }[] = [];

  let flag = false;
  await Promise.all(
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

      if (!department || !position || findUser) flag = true;
    })
  );

  if (flag)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "Department or Position not found or email already exists",
      },
    };

  const updatedUsers = await Promise.all(
    users.map(async (user) => {
      const { skills, ...data } = user;

      const result = await DepartmentModel.findOneAndUpdate(
        { DID: data.DID },
        { $inc: { teamSize: 1 } },
        { session, new: true }
      );
      if (!result) throw new Error("Department not updated");
      const id = await generateId(IDs.EID, session);
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

  const insertedUsers = await User.create(updatedUsers, { session });

  // console.log(usersEmailData);

  insertedUsers.forEach((user, idx) => {
    sendVerificationEmail({ ...usersEmailData[idx], _id: user._id });
  });

  return {
    status: HttpStatusCodes.CREATED,
    data: updatedUsers,
  };
};

export const updateUserSkills = async (req: Request) => {
  const { EID } = req.params;
  const user: UserAuth | null = await User.findOne({ EID: EID });
  if (!user)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "user not found",
      },
    };
  const { skills } = UpdateUserSkills.parse({ skills: req.body.skills });
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
};

export const getAllUsers = async (req: Request) => {
  const { types, page = 1, search = "" } = req.query;
  const filter: FilterQuery<UserAuthModel> = {};
  const pageNum = Number(page) - 1;
  if (types) {
    const typesArray = (types as string).split(",");
    UsersArraySchema.parse(typesArray);
    filter.role = { $in: typesArray };
  }

  if (search !== "") filter.$text = { $search: search as string };

  const users = await User.paginate(filter, {
    offset: pageNum * 6,
    limit: 6,
  });

  return {
    status: HttpStatusCodes.OK,
    data: users,
  };
};

export const getAllUsersDetails = async (req: Request) => {
  const { types, page = 1, search = "" } = req.query;
  const filter: FilterQuery<UserAuthModel> = {};
  const pageNum = Number(page) - 1;
  if (types) {
    const typesArray = (types as string).split(",");
    UsersArraySchema.parse(typesArray);
    filter.role = { $in: typesArray };
  }

  if (search !== "") filter.$text = { $search: search as string };

  const users = await User.paginate(filter, {
    offset: pageNum * 6,
    limit: 6,
    select: {
      EID: 1,
      email: 1,
      fullName: 1,
      role: 1,
      phone: 1,
      gender: 1,
      workmode: 1,
      img: 1,
      freelanceRating: 1,
      freelanceRewardPoints: 1,
      gigsCompleted: 1,
      DID: 1,
    },
  });

  return {
    status: HttpStatusCodes.OK,
    data: users,
  };
};

export const deleteUserByID = async (req: Request) => {
  const { ID } = req.params;
  GetUserSchema.parse({ EID: ID });
  const user = await User.findOne({ EID: ID });
  if (!user)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "user not found",
      },
    };
  const result = await User.deleteOne({ EID: ID });
  if (result.acknowledged === false)
    return {
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      data: {
        msg: "failed to delete user",
      },
    };
  return {
    status: HttpStatusCodes.OK,
    data: {
      msg: "user deleted successfully",
    },
  };
};

export const getUserById = async (req: Request) => {
  const { ID } = req.params;

  GetUserSchema.parse({ EID: ID });
  const user = (await User.findOne({ EID: ID })) as UserWithRole;
  if (!user)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "user not found",
      },
    };
  return {
    status: HttpStatusCodes.OK,
    data: user,
  };
};

export const uploadProfileImg = async (
  req: Request,
  _res: Response,
  session: ClientSession
) => {
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
  return {
    status: HttpStatusCodes.OK,
    data: {
      fileUrl: presignedUrl,
    },
  };
};

export const getProfile = async (req: Request) => {
  const EID = req.user?.EID;
  const user = await User.findOne({ EID: EID });
  if (!user) throw new Error("User not found");
  return {
    status: HttpStatusCodes.OK,
    data: user,
  };
};

export const updateProfile = async (req: Request) => {
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
  if (!updatedUser)
    return {
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      data: {
        msg: "error updating the user",
      },
    };
  return {
    status: HttpStatusCodes.OK,
    data: updatedUser,
  };
};

export const getGigsByUser = async (req: Request) => {
  const { page = 1, search = "", DIDs, ManagerIDs } = req.query;
  const pageNum = Number(page) - 1;
  const EID = req.user?.EID;
  let filter: FilterQuery<UserAuthModel> = {};

  const user = (await User.findOne({ EID: EID })) as UserWithRole;
  if (!user) {
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      message: "userNotfound",
    };
  }

  if (DIDs) {
    z.array(
      z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
    ).parse(DIDs);
    filter.DID = { $in: DIDs };
  }
  if (ManagerIDs) {
    z.array(
      z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
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
      $text: { $search: search as string },
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
};

export const resendVerifyMail = async (req: Request) => {
  const { email } = req.body;
  z.string().email({ message: "Invalid email" }).parse(email);

  const user: (UserAuth & { _id: Types.ObjectId }) | null = await User.findOne({
    email: email,
  });
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
  User.findOneAndUpdate(
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
    data: {
      msg: "verification mail sent successfully",
    },
  };
};

export const getEmployeesUnderManager = async (req: Request) => {
  const EID = req.user?.EID;
  const { page = 1 } = req.query;

  const pageNum = Number(page) - 1;
  const users = await User.paginate(
    { ManagerID: EID },
    { offset: pageNum * 6, limit: 6 }
  );

  if (!users) {
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      message: "No users found",
    };
  }

  return {
    status: HttpStatusCodes.OK,
    data: users,
  };
};

export const userControlRouter = Router();

userControlRouter.post(
  "/create",
  checkAuth([UserRole.Admin]),
  sessionHandler(createUser)
);
userControlRouter.get(
  "",
  checkAuth([UserRole.Admin, UserRole.Manager]),
  sessionHandler(getAllUsers)
);
userControlRouter.delete(
  "/:ID",
  checkAuth([UserRole.Admin]),
  sessionHandler(deleteUserByID)
);
userControlRouter.get(
  "/get-user/:ID",
  checkAuth([]),
  sessionHandler(getUserById)
);
userControlRouter.get("/my-gigs", checkAuth([]), sessionHandler(getGigsByUser));
userControlRouter.post(
  "/upload-img",
  checkAuth([]),
  sessionHandler(uploadProfileImg)
);
userControlRouter.get("/profile", checkAuth([]), sessionHandler(getProfile));
userControlRouter.post(
  "/update-profile",
  checkAuth([]),
  sessionHandler(updateProfile)
);
userControlRouter.post(
  "/update-user-skills/:EID",
  checkAuth([UserRole.Admin, UserRole.Manager]),
  sessionHandler(updateUserSkills)
);
userControlRouter.post("/resend-verify-mail", sessionHandler(resendVerifyMail));
userControlRouter.get(
  "/users-details",
  checkAuth([]),
  sessionHandler(getAllUsersDetails)
);
userControlRouter.get(
  "/users-under-manager",
  checkAuth([UserRole.Manager]),
  sessionHandler(getEmployeesUnderManager)
);
