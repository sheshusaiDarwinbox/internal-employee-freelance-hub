import mongoose from "mongoose";
import { error } from "./error.util";
import { Request, Response } from "express";

export const sessionHandler = (fun: (req: Request, res: Response) => any) => {
  return async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await fun(req, res);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      if (!res.headersSent) error(err, res);
    } finally {
      await session.endSession();
    }
  };
};
