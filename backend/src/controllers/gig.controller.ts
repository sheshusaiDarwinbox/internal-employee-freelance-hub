import { type Request, type Response, Router } from "express";
import { CreateGigZodSchema, GetIDSchema } from "../utils/zod.util";
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

export const gigControlRouter = Router();

export const createGig = sessionHandler(
  async (req: Request, res: Response, session) => {
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

export const getAllGigs = sessionHandler(
  async (req: Request, res: Response) => {
    const {
      DIDs,
      ManagerIDs,
      search,
      page = 1,
      approvalStatus = "APPROVED",
    } = req.query;

    const parsedManagerIDs = splitStringByCommas(ManagerIDs as string);
    let filter: any = {};
    if (DIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
      ).parse(DIDs);
      filter.DID = { $in: DIDs };
    }
    if (parsedManagerIDs) {
      z.array(
        z
          .string()
          .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })
      ).parse(parsedManagerIDs);
      filter.ManagerID = { $in: parsedManagerIDs };
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
  }
);

export const getGigById = sessionHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const assignGig = sessionHandler(async (req: Request, res: Response) => {
  const { GigID, BidID, EID } = req.body;
  console.log(req.body);

  const gig = await Gig.findOne({ GigID: GigID });
  const bid: Bid | null = await BidModel.findOne({ BidID: BidID });
  console.log(gig);
  console.log(bid);
  if (gig && bid && bid.GigID === GigID) {
    const updatedGig = await Gig.findOneAndUpdate(
      { GigID: GigID },
      {
        $set: {
          EID: EID,
          ongoingStatus: "Ongoing",
        },
      }
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
});

export const getMyGigs = sessionHandler(async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  const pageNum = Number(page);

  const gigs = await Gig.paginate(
    { EID: req.user?.EID },
    {
      limit: 6,
      offset: (pageNum - 1) * 6,
    }
  );

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

gigControlRouter.post("/post", checkAuth([UserRole.Manager]), createGig);
gigControlRouter.get("", checkAuth([]), getAllGigs);
gigControlRouter.get("/:GigID", checkAuth([]), getGigById);
gigControlRouter.post("/assign", checkAuth([UserRole.Manager]), assignGig);
gigControlRouter.post("/my-gigs", checkAuth([]), getMyGigs);
