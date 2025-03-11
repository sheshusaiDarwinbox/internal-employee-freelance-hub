import type { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { ReferModel } from "../models/refer.model";
import { generateId } from "../utils/counterManager.util"; // Importing generateId
import { ClientSession } from "mongoose";
import { IDs } from "../models/idCounter.model"; // Importing IDs enum
import { sessionHandler } from "../utils/session.util"; // Importing sessionHandler
import { Router } from "express"; // Importing Router
import { checkAuth } from "../middleware/checkAuth.middleware"; // Importing checkAuth middleware
import { UserRole } from "../models/userAuth.model";

// Create a new referral
export const createReferral = sessionHandler(
  async (req: Request, res: Response, session) => {
    const GigID = req.params.GigID; // Assuming gigId is passed in the URL
    const EID = req.user?.EID; // Safely accessing EID from the authenticated user session
    if (!EID) {
      return res.status(401).json({ message: "Unauthorized: EID not found" });
    }
    const { email, name, desc, skillset } = req.body;

    const RefID = await generateId(IDs.RefID, session); // Generate RefID using the correct enum

    const newReferral = new ReferModel({ RefID, GigID, EID, email, name, desc, skillset });
    await newReferral.save({ session });
    
    return {
      status: HttpStatusCodes.CREATED,
      data: newReferral,
    };
  }
);

// Get all referrals
export const getReferrals = sessionHandler(
  async (req: Request, res: Response) => {
    const referrals = await ReferModel.find();
    return {
      status: HttpStatusCodes.OK,
      data: referrals,
    };
  }
);

// Define the router for referrals
export const ReferControlRouter = Router();

// Route for creating a new referral
ReferControlRouter.post("/post/:GigID",checkAuth([UserRole.Employee]), createReferral); // Assuming gigId is passed in the URL

// Route for getting all referrals
ReferControlRouter.get("/",checkAuth([UserRole.Manager,UserRole.Admin]), getReferrals);
