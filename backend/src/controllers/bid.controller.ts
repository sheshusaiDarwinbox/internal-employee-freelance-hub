import { Request, Response, Router } from "express";
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

bidControlRouter.post("/post", checkAuth([UserRole.Employee]), createBid);
bidControlRouter.get("/:GigID", checkAuth([UserRole.Manager]), getBidsByGig);
