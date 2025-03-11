import { Request, Response, Router } from "express";
import { ApprovalStatus, OngoingStatus } from "../models/gig.model"; // Import enums
import type { Bid } from "../types/bid.types"; // Import Bid type
import { sessionHandler } from "../utils/session.util";
import { BidZodSchema } from "../utils/zod.util";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { BidModel } from "../models/bid.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserRole } from "../models/userAuth.model";
import { z } from "zod";
import { Gig } from "../models/gig.model";
import type { GigModel } from "../types/gig.types"; // Import GigSchema type
import { Document } from "mongoose"; // Import Mongoose Document type
import { GigSchema } from "../models/gig.model"; // Import GigModel type
import { client } from "../database/connection";

export const bidControlRouter = Router();

export const createBid = sessionHandler(
  async (req: Request, res: Response, session) => {
    const data = BidZodSchema.parse(req.body);
    const findBid = await BidModel.findOne({
      EID: req.user?.EID,
      GigID: data.GigID,
    });
    if (findBid)
      return {
        status: HttpStatusCodes.CONFLICT,
        data: {
          msg: "Already Bid for this Gig",
        },
      };
    const BidID = await generateId(IDs.BidID, session);
    const [bid] = await BidModel.create(
      [
        {
          BidID: BidID,
          ...data,
        },
      ],
      { session }
    );

    return {
      status: HttpStatusCodes.CREATED,
      data: bid,
    };
  }
);

export const getBidsByGig = sessionHandler(
  async (req: Request, res: Response) => {
    const { GigID } = req.params;
    const { page = 1 } = req.query;
    const pageNum = Number(page) - 1;
    z.string()
      .regex(/^[a-zA-Z0-9]+$/, { message: "GigID must be alphanumeric" })
      .parse(GigID);

    const gig = await Gig.findOne({ GigID: GigID });
    if (!gig)
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Gig does not exist",
        },
      };

    const bids = await BidModel.aggregate([
      { $match: { GigID: GigID } },
      { $skip: pageNum * 6 },
      { $limit: 6 },
      {
        $lookup: {
          from: "userauths",
          localField: "EID",
          foreignField: "EID",
          as: "userauth",
        },
      },
      {
        $project: {
          GigID: 1,
          BidID: 1,
          description: 1,
          "userauth.fullName": 1,
          "userauth.EID": 1,
        },
      },
    ]);

    if (!bids)
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        data: {
          msg: "Failed to retreive bids",
        },
      };

    const total = await BidModel.countDocuments({ GigID: GigID });
    return {
      status: HttpStatusCodes.OK,
      data: {
        docs: bids,
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

export const assignGig = sessionHandler(
  async (req: Request, res: Response,session) => {
    const { bidID } = req.params;

    // Fetch the bid using the bidID
    const bid = await BidModel.findOne({ BidID: bidID });
    if (!bid) {
      return {
        status: HttpStatusCodes.NOT_FOUND,
        data: {
          msg: "Bid not found",
        },
      };
    }

    const { GigID, EID } = bid as unknown as Bid; // Use unknown to assert Bid type
    const gig = await Gig.findOne({ GigID: GigID }) as GigSchema; // Use the Gig model directly

    if (!gig) {
      return {
        status: HttpStatusCodes.NOT_FOUND,
        data: {
          msg: "Gig not found",
        },
      };
    }

    // Check if the gig already has an EID assigned
    if (gig.EID) {
      return {
        status: HttpStatusCodes.CONFLICT,
        data: {
          msg: "The gig was already assigned",
        },
      };
    }
    const updatedGig = await Gig.findOneAndUpdate(
      { GigID: GigID },
      {
        EID: EID,
        approvalStatus: ApprovalStatus.APPROVED,
        ongoingStatus: OngoingStatus.Ongoing,
        assignedAt: new Date(), // Add assignedAt timestamp
      },
      { new: true } // Return the updated document
    );

    if (!updatedGig) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        data: {
          msg: "Failed to update gig",
        },
      };
    }

    return {
      status: HttpStatusCodes.OK,
      data: {
        msg: "Gig assigned successfully",
        gig: updatedGig,
      },
    };
  },
);

bidControlRouter.post("/post", checkAuth([UserRole.Employee]), createBid);
bidControlRouter.post("/assign/:bidID", checkAuth([UserRole.Manager]), assignGig);
bidControlRouter.get("/:GigID", checkAuth([UserRole.Manager]), getBidsByGig);
