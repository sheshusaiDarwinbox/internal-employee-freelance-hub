import mongoose from "mongoose";
import { Request, Response } from "express";

export const sessionHandler = (
  fun: (
    req: Request,
    res: Response,
    session: mongoose.ClientSession
  ) => Promise<{ status?: number; data?: any } | void>
) => {
  return async (req: Request, res: Response): Promise<void> => {
    let session: mongoose.ClientSession | null = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const result = await fun(req, res, session);

      await session.commitTransaction();

      if (result && !res.headersSent) {
        res.status(result.status || 200).json(result.data || result);
      }
    } catch (err) {
      console.error("session error:", err);

      if (session) {
        await session.abortTransaction();
      }

      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: (err as Error).message || "Transaction failed" });
      }
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  };
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});
