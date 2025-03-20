import { type Request, type Response, Router } from "express";
import { CreateGigZodSchema } from "../utils/zod.util";
import { User, UserRole } from "../models/userAuth.model";
import { ApprovalStatus, OngoingStatus, Gig } from "../models/gig.model";
import { RequestModel, RequestTypeEnum } from "../models/request.model";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserAuth } from "../types/userAuth.types";
import { sessionHandler } from "../utils/session.util";
import { z } from "zod";
import { splitStringByCommas } from "../utils/requestParsing.util";
import { BidModel } from "../models/bid.model";
import { Bid } from "../types/bid.types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidV4 } from "uuid";
import { GigModel, GigSchema } from "../types/gig.types";
import multer from "multer";
import { NotificationModel } from "../models/notification.model";
import { FilterQuery } from "mongoose";
const upload = multer();

export const gigControlRouter = Router();

export const createGig = sessionHandler(
  async (req: Request, _res: Response, session) => {
    console.log(req.body);
    req.body.ManagerID = req.user?.EID;
    req.body.rewardPoints = parseInt(req.body.rewardPoints);
    const data = CreateGigZodSchema.parse(req.body);

    console.log(data);

    const manager: UserAuth | null = await User.findOne({
      EID: data.ManagerID,
    });
    const GigID = await generateId(IDs.GigID, session);

    if (!manager || !GigID)
      throw new Error("manager not found or GigID not created");

    const gigdata = {
      ...data,
      DID: manager.DID,
      GigID: GigID,
      createdAt: Date.now(),
      ongoingStatus: OngoingStatus.UnAssigned,
      approvalStatus:
        data.amount > 0 ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED,
    };

    const [gig] = await Gig.create([gigdata], { session });

    if (!gig) throw new Error("failed to create gig");

    if (data.amount > 0) {
      const request = await RequestModel.create({
        ReqID: await generateId(IDs.ReqID, session),
        From: data.ManagerID,
        To: "EMP000000",
        reqType: RequestTypeEnum.ApproveGig,
        description: `Request to approve gig from ${data.ManagerID}`,
      });
      if (!request) throw new Error("failed to create request");
    }
    return {
      status: HttpStatusCodes.CREATED,
      data: gigdata,
    };
  }
);

export const getAllGigs = sessionHandler(async (req: Request) => {
  const {
    DIDs,
    ManagerIDs,
    search,
    page = 1,
    approvalStatus = "APPROVED",
  } = req.query;

  const parsedManagerIDs = splitStringByCommas(ManagerIDs as string);
  let filter: FilterQuery<GigModel> = {};
  if (DIDs) {
    z.array(
      z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
    ).parse(DIDs);
    filter.DID = { $in: DIDs };
  }
  if (parsedManagerIDs) {
    z.array(
      z.string().regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
    ).parse(parsedManagerIDs);
    filter.ManagerID = { $in: parsedManagerIDs };
  }
  if (search && search !== "") {
    z.string().regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "search must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    );
    filter = {
      ...filter,
      $text: { $search: search as string },
    };
  }
  filter.approvalStatus = approvalStatus;

  const gigs = await Gig.aggregate([
    { $match: filter },
    { $skip: (Number(page) - 1) * 6 },
    { $limit: 6 },
    {
      $lookup: {
        from: "departments",
        localField: "DID",
        foreignField: "DID",
        as: "department",
      },
    },
    {
      $lookup: {
        from: "userauths",
        localField: "ManagerID",
        foreignField: "EID",
        as: "userauth",
      },
    },
    {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        GigID: 1,
        DID: 1,
        ManagerID: 1,
        title: 1,
        description: 1,
        deadline: 1,
        approvalStatus: 1,
        ongoingStatus: 1,
        skills: 1,
        createdAt: 1,
        rewardPoints: 1,
        amount: 1,
        img: 1,
        "department.name": 1,
        "userauth.fullName": 1,
      },
    },
  ]);

  const total = await Gig.countDocuments(filter);

  const pageNum = Number(page) - 1;
  return {
    status: HttpStatusCodes.OK,
    data: {
      docs: gigs,
      totalDocs: total,
      limit: 6,
      page: pageNum + 1,
      totalPages: Math.ceil(total / 6),
      hasNextPage: (pageNum + 1) * 6 < total,
      nextPage: (pageNum + 1) * 6 < total ? pageNum + 2 : null,
      hasPrevPage: pageNum > 0,
      prevPage: pageNum > 0 ? pageNum : null,
    },
  };
});

export const getGigById = sessionHandler(async (req: Request) => {
  const { GigID } = req.params;
  const gig = await Gig.findOne({ GigID: GigID });
  if (!gig)
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "Gig not found",
      },
    };
  return {
    status: HttpStatusCodes.OK,
    data: gig,
  };
});

export const assignGig = sessionHandler(
  async (req: Request, _res: Response, session) => {
    const { GigID, BidID, EID } = req.body;
    console.log(req.body);

    const gig: GigSchema | null = await Gig.findOne({ GigID: GigID });
    const bid: Bid | null = await BidModel.findOne({ BidID: BidID });
    if (gig && bid && bid.GigID === GigID) {
      const updatedGig = await Gig.findOneAndUpdate(
        { GigID: GigID },
        {
          $set: {
            EID: EID,
            ongoingStatus: "Ongoing",
            assignedAt: Date.now(),
          },
        }
      );

      await NotificationModel.create(
        [
          {
            NID: await generateId(IDs.NID, session),
            EID: EID,
            description: `You have been assigned to gig ${GigID}`,
            From: `Manager ${gig.ManagerID}`,
            read: false,
          },
        ],
        { session }
      );

      return {
        status: HttpStatusCodes.OK,
        data: updatedGig,
      };
    }

    return {
      status: HttpStatusCodes.BAD_REQUEST,
      data: {
        msg: "Bad Request",
      },
    };
  }
);

export const getMyGigs = sessionHandler(async (req: Request) => {
  const { page = 1, type = "Ongoing", search = "" } = req.query;
  const pageNum = Number(page);

  let filter: FilterQuery<GigModel> = {};
  filter.EID = req.user?.EID;
  const parsedTypes = splitStringByCommas(type as string);
  filter.ongoingStatus = { $in: parsedTypes };
  if (search && search !== "") {
    z.string().regex(
      /^[a-zA-Z0-9\s.,!?()&]+$/,
      "search must be alphanumeric with grammar notations (e.g., spaces, punctuation)."
    );
    filter = {
      ...filter,
      $text: { $search: search as string },
    };
  }
  const gigs = await Gig.paginate(filter, {
    limit: 6,
    offset: (pageNum - 1) * 6,
  });

  console.log(gigs);
  if (gigs)
    return {
      status: HttpStatusCodes.OK,
      data: gigs,
    };

  return {
    status: HttpStatusCodes.BAD_REQUEST,
    data: {
      msg: "bad request",
    },
  };
});

export const updateGigProgress = sessionHandler(
  async (req: Request, _res: Response, session) => {
    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    console.log(process.env.S3_BUCKET);
    console.log(process.env.S3_REGION);

    const { _id } = req.params;
    const { subject, description, work_percentage } = req.body;
    const files = req.files as Express.Multer.File[];

    const gig: GigSchema | null = await Gig.findById(_id);
    if (!gig) {
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Gig not found",
        },
      };
    }

    const fileUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const fileKey = `gigs/${_id}/${uuidV4()}-${file.originalname}`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;
        fileUrls.push(fileUrl);
      }
    }

    const progressUpdate = {
      subject: subject || "Progress Update",
      description,
      work_percentage: Number(work_percentage),
      files: fileUrls,
    };

    let ongoingStatus = gig.ongoingStatus;
    if (Number(work_percentage) === 100) {
      ongoingStatus = "Completed";
    }

    const updatedGig = await Gig.findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          progressTracking: progressUpdate,
        },
        $set: {
          ongoingStatus: ongoingStatus,
          completedAt: Number(work_percentage) === 100 ? Date.now() : undefined,
        },
      }
    );

    const GigID = gig.GigID;

    await NotificationModel.create(
      [
        {
          NID: await generateId(IDs.NID, session),
          EID: gig.ManagerID,
          description: `Updated the progress of gig ${GigID}`,
          From: `Employee ${gig.EID}`,
          read: false,
        },
      ],
      { session }
    );

    return {
      status: HttpStatusCodes.OK,
      data: updatedGig,
    };
  }
);

export const updateGigReview = sessionHandler(
  async (req: Request, _res: Response, session) => {
    const { GigID } = req.params;
    const { feedback, rating } = req.body;

    z.object({
      feedback: z.string(),
      rating: z.number().min(0).max(5),
    }).parse(req.body);

    const gig: GigSchema | null = await Gig.findOne({ GigID: GigID });
    if (!gig) {
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Gig not found",
        },
      };
    }

    const updatedGig = await Gig.findOneAndUpdate(
      { GigID: GigID },
      {
        $set: {
          feedback,
          rating,
          ongoingStatus: "Reviewed",
        },
      },
      { session }
    );

    const user: UserAuth | null = await User.findOne({ EID: gig.EID });
    if (user) {
      await User.findOneAndUpdate(
        { EID: gig.EID },
        {
          $set: {
            freelanceRating:
              (user?.freelanceRating || 0 + rating) /
              ((user?.gigsCompleted || 0) + 1),
            freelanceRewardPoints:
              (user.freelanceRewardPoints || 0) + (gig.rewardPoints || 0),
            gigsCompleted: (user.gigsCompleted || 0) + 1,
            amount: (user.accountBalance || 0) + (gig.amount || 0),
          },
        },
        { session, upsert: true }
      );
    }

    await NotificationModel.create(
      [
        {
          NID: await generateId(IDs.NID, session),
          EID: gig.EID,
          description: `Reviewd your gig ${GigID}`,
          From: `Manager ${gig.ManagerID}`,
          read: false,
        },
      ],
      { session }
    );

    return {
      status: HttpStatusCodes.OK,
      data: updatedGig,
    };
  }
);

gigControlRouter.post("/post", checkAuth([UserRole.Manager]), createGig);
gigControlRouter.get("", checkAuth([]), getAllGigs);
gigControlRouter.get("/:GigID", checkAuth([]), getGigById);
gigControlRouter.post("/assign", checkAuth([UserRole.Manager]), assignGig);
gigControlRouter.post("/my-gigs", checkAuth([]), getMyGigs);
gigControlRouter.post(
  "/:_id/update-progress",
  checkAuth([]),
  upload.array("files"),
  updateGigProgress
);
gigControlRouter.post("/:GigID/review", checkAuth([]), updateGigReview);