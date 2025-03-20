import { Request, Response } from "express";
import { sessionHandler } from "../utils/session.util";
import mongoose from "mongoose";

jest.mock("../utils/session.util", () => ({
  sessionHandler: jest.fn().mockImplementation(
    (
      handler: (
        req: Request,
        res: Response,
        session?: mongoose.ClientSession
      ) => Promise<{
        status: number;
        data: Object;
      }>
    ) => {
      async (req: Request, res: Response) => {
        const mockSession = {
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          abortTransaction: jest.fn(),
          endSession: jest.fn(),
        } as unknown as mongoose.ClientSession;

        try {
          const result = await handler(req, res, mockSession);
          await mockSession.commitTransaction();
          res.status(result.status).json(result.data);
        } catch (error) {
          await mockSession.abortTransaction();
          res.status(500).json({
            error: (error as Error).message || "Transaction Failed",
          });
          throw error;
        } finally {
          await mockSession.endSession();
        }
      };
    }
  ),
}));

describe("user controller", () => {
  describe("create user", () => {
    const mockRequest = {
      DID: "D000001",
      PID: "P000001",
      role: "",
      ManagerID: "EMP000001",
      email: "temp@gmail.com",
      skills: [
        {
          skill: "React",
          score: 0.8,
        },
      ],
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    it("should call sessionHandler with the correct arguments", async () => {
      const mockHandler = jest.fn(async (req, res, session) => {});
    });
  });
});
