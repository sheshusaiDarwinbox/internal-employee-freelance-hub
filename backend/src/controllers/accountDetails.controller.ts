import { Request, Response } from "express";
import { AccountDetailsModel } from "../models/accountDetails.model";
import { Router } from "express";
import {  UserRole } from "../models/userAuth.model";
import { checkAuth } from "../middleware/checkAuth.middleware";
import { createPaymentIntent, handlePaymentSuccess } from '../service/stripe.service';

// Create a new account details
export const createAccountDetails = async (req: Request, res: Response) => {
  try {
    const accountDetails = new AccountDetailsModel(req.body);
    await accountDetails.save();
    res.status(201).json(accountDetails);
  } catch (error) {
    res.status(400).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

// Get a single account details by ID
export const getAccountDetailsByEID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { EID } = req.params; // Extract EID from request parameters

    if (!EID) {
      res.status(400).json({ message: "EID parameter is missing" });
      return;
    }

    const accountDetails = await AccountDetailsModel.findOne({ EID: EID }); // Use findOne with EID

    if (!accountDetails) {
      res.status(404).json({ message: "Account details not found for the given EID" });
      return;
    }

    res.status(200).json(accountDetails);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

// Update an account details
export const updateAccountDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountDetails = await AccountDetailsModel.findOneAndUpdate({ EID: req.params.EID }, req.body, { new: true });
    if (!accountDetails) {
      res.status(404).json({ message: "Account details not found" });
      return; // Ensure to return after sending a response
    }
    res.status(200).json(accountDetails);
  } catch (error) {
    res.status(400).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
}

// Delete an account details
export const deleteAccountDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountDetails = await AccountDetailsModel.findByIdAndDelete(req.params.id);
    if (!accountDetails) {
      res.status(404).json({ message: "Account details not found" });
      return; // Ensure to return after sending a response
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
}

export const accountDetailsControlRouter = Router();

accountDetailsControlRouter.post("/create", checkAuth([UserRole.Employee,UserRole.Admin]), createAccountDetails);
accountDetailsControlRouter.get("/:EID", checkAuth([ UserRole.Employee,UserRole.Manager]), getAccountDetailsByEID);
accountDetailsControlRouter.put("/:EID", checkAuth([ UserRole.Employee,UserRole.Manager]), updateAccountDetails);
// accountDetailsControlRouter.delete("/:ID", checkAuth([UserRole.Admin]), deleteUserByID);

accountDetailsControlRouter.post('/create-payment-intent', checkAuth([UserRole.Employee, UserRole.Manager]), createPaymentIntent);
accountDetailsControlRouter.post('/payment-success', checkAuth([UserRole.Employee, UserRole.Manager]), handlePaymentSuccess);