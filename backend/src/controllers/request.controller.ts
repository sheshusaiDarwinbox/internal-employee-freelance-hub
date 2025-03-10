import { Request, Response, Router } from "express";
import { sessionHandler } from "../utils/session.util";
import { RequestZodSchema } from "../utils/zod.util";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { RequestModel } from "../models/request.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { UserRole } from "../models/userAuth.model";
import { Gig } from "../models/gig.model";
import { createUser } from "./user.controller";
import { UserAuth } from "../types/userAuth.types"; // Import UserAuth type

export const requestControlRouter = Router();

interface CreateUserResponse {
  data: {
    user: {
      EID: string;
    };
  };
}

export const createRequest = sessionHandler(
  async (req: Request, res: Response, session) => {
    const { GID } = req.params; // Get GID from request parameters
    const { reqType, description, name, email, skillset } = req.body; // Get reqType, description, name, email, and skillset from body

    const ReqID = await generateId(IDs.ReqID, session); // Generate ReqID
    const gig = await Gig.findOne({ GigID: GID }) as any; // Fetch gig details using GID
    if (!gig) {
      return res.status(HttpStatusCodes.NOT_FOUND).send({ message: "Gig not found" });
    }

    const request = await RequestModel.create({
      ReqID: ReqID,
      From: req.user?.EID, // Set From to authenticated user's EID
      // To: gig.ManagerID, // Set To to the ManagerID based on reqType
      To:"EMP000000",
      reqStatus: "Pending", // Set reqStatus to Pending by default
      reqType: reqType,
      name: reqType === "CreateUser" ? name : undefined, // Add name if reqType is CreateUser
      email: reqType === "CreateUser" ? email : undefined, // Add email if reqType is CreateUser
      skillset: reqType === "CreateUser" ? skillset : undefined, // Add skillset if reqType is CreateUser
      description: description,
      GID: GID, // Add GID to the request document
    });

    return res.status(HttpStatusCodes.CREATED).send({ data: request }); // Return an object with a data property
  }
);

export const approveOrRejectRequest = sessionHandler(
  async (req: Request , res: Response, session) => { // Update req type to include user
    const { requestId } = req.params; // Get requestId from request parameters
    const { reqStatus } = req.body; // Get reqStatus from body

    const request = await RequestModel.findOne({ ReqID: requestId }) as any; // Fetch the request by ReqID and cast to any
    const gig = await Gig.findOne({ GigID: request.GID }) as any; // Fetch gig details using GID
    if (!gig) {
        return res.status(HttpStatusCodes.NOT_FOUND).send({ message: "Gig not found" });
    }
    if (!request) {
      return res.status(HttpStatusCodes.NOT_FOUND).send({ message: "Request not found" });
    }

    // Update the request status
    request.reqStatus = reqStatus;
    await request.save({ session });

    // Fetch user email from User model
    const user = req.user; // Ensure user is retrieved from the request
    if (!user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User not authenticated" });
    }

    const userEmail = user.email; // Access email property directly
    if (!userEmail) {
        return res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User email not found" });
    }

    // Call createUser method if the request is approved
    if (reqStatus === "Complete") {
      const requestDoc = await RequestModel.findOne({ ReqID: requestId }) as any;
      const emailToUse = requestDoc?.email || userEmail;
      const reqType = request.reqType;
      const gid = request.GID;

      if (reqType === "CreateUser") {
        try {
          const createUserResponse = (await createUser({
            body: {
              PID: "P00000O",
              DID: "D00000O",
              ManagerID: request.From,
              doj: new Date().toISOString(),
              email: emailToUse,
              role: request.role || "Other",
            },
          } as Request, res)); // Removed the casting to CreateUserResponse

          if (createUserResponse as any ) {
            const newEID = createUserResponse.user.EID; // Ensure this is correctly accessed
            console.log("Gid:", gid, "newID:", newEID);
            await Gig.findOneAndUpdate({ GID: gid }, { EID: newEID });
          } else {
            console.error(
              "Unexpected response from createUser:",
              createUserResponse
            );
            return res
              .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
              .send({ message: "Failed to create user." });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return res
            .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: "Failed to create user." });
        }
      } else if (reqType === "ApproveGig") {
        console.log("Gid:", gid, "newID:", request.From);
        await Gig.findOneAndUpdate({ GID: gid }, { EID: request.From });
        await RequestModel.findOneAndUpdate({ ReqID: requestId },{reqStatus:"Complete"});
      }  
      // Send approval email related to reqType
      const approvalMessage = reqType === "ApproveGig" 
        ? "Your gig has been approved." 
        : "Your request has been approved.";
      console.log("Sending approval email:", approvalMessage);
      // await sendEmail(emailToUse, approvalMessage);
    
    } else if (reqStatus === "Rejected") {
      // Send rejection email
      await RequestModel.findOneAndUpdate({ ReqID: requestId },{reqStatus:"Complete"});
      const rejectionMessage = request.description || "Your request has been rejected.";
      // await sendEmail(userEmail, rejectionMessage);
    }
    return res.status(HttpStatusCodes.OK).send({ message: "Request processed successfully" });
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
    res.status(HttpStatusCodes.OK).send({ data: requests }); // Return requests in a data property
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
    res.status(HttpStatusCodes.OK).send({ data: requests }); // Return requests in a data property
  }
);

requestControlRouter.post(
  "/create",
  checkAuth([UserRole.Manager]),
  createRequest
);

requestControlRouter.get("/sent", checkAuth([]), getSentRequests);
requestControlRouter.get("/received", checkAuth([]), getReceivedRequests);
requestControlRouter.post(
  "/approve-reject/:requestId",
  checkAuth([UserRole.Manager]), // Assuming only managers can approve/reject
  approveOrRejectRequest
);
