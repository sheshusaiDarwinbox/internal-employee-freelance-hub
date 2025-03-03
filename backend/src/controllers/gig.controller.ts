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

export const gigControlRouter = Router();

export const createGig = sessionHandler(
  async (req: Request, res: Response, session) => {
    const data = CreateGigZodSchema.parse(req.body);

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

    const gig = await Gig.create(gigdata);

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
    res.status(HttpStatusCodes.CREATED).send(data);
  }
);

export const getAllGigs = sessionHandler(
  async (req: Request, res: Response) => {
    const { DIDs, ManagerIDs, search, page = 0 } = req.query;
    let filter: any = {};
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

    const gigs = await Gig.paginate(filter, {
      offset: Number(page) * 10,
      limit: 10,
    });
    res.status(HttpStatusCodes.OK).send(gigs);
  }
);

export const getGigById = sessionHandler(
  async (req: Request, res: Response) => {
    const { GigID } = req.params;
    GetIDSchema.parse({ ID: GigID });
    const gig = await Gig.findOne({ PID: GigID });
    res.status(HttpStatusCodes.OK).send(gig);
  }
);

gigControlRouter.post("/post", checkAuth([UserRole.Manager]), createGig);
gigControlRouter.get("", checkAuth([]), getAllGigs);
gigControlRouter.get("/:GigID", checkAuth([]), getGigById);
