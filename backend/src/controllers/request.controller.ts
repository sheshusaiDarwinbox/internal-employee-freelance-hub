import { Request, Response, Router } from "express";
import { sessionHandler } from "../utils/session.util";
import { RequestZodSchema } from "../utils/zod.util";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { RequestModel } from "../models/request.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserRole } from "../models/userAuth.model";

export const requestControlRouter = Router();

export const createRequest = sessionHandler(
  async (req: Request, res: Response, session) => {
    RequestZodSchema.parse(req.body);
    const { reqType } = req.body;
    const ReqID = generateId(IDs.ReqID, session);
    const request = await RequestModel.create({
      ReqID: ReqID,
      From: req.user?.EID,
      To: "EMP000000",
      reqType: reqType,
      description: "create user request to admin",
    });
    return {
      status: HttpStatusCodes.CREATED,
      data: request,
    };
  }
);

export const getReceivedRequests = sessionHandler(
  async (req: Request, res: Response) => {
    const { page = 0 } = req.params;
    const requests = await RequestModel.paginate(
      { To: req.user?.EID },
      {
        offset: Number(page) * 10,
        limit: 10,
      }
    );
    res.status(HttpStatusCodes.OK).send(requests);
  }
);

export const getSentRequests = sessionHandler(
  async (req: Request, res: Response) => {
    const { page = 0 } = req.params;
    const requests = await RequestModel.paginate(
      { From: req.user?.EID },
      {
        offset: Number(page) * 10,
        limit: 10,
      }
    );
    res.status(HttpStatusCodes.OK).send(requests);
  }
);

requestControlRouter.post(
  "/create",
  checkAuth([UserRole.Manager]),
  createRequest
);

requestControlRouter.get("/sent", checkAuth([]), getSentRequests);
requestControlRouter.get("/received", checkAuth([]), getReceivedRequests);
