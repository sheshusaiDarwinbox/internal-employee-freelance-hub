import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  createGig,
  getAllGigs,
  getGigById,
  assignGig,
  getMyGigs,
  updateGigProgress,
  updateGigReview,
} from "../controllers/gig.controller";
import { Gig } from "../models/gig.model";
import { NotificationModel } from "../models/notification.model";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { ApprovalStatus, OngoingStatus } from "../models/gig.model";
import { parseFile } from "../utils/fileParser.util";

jest.mock("../models/notification.model", () => ({
  NotificationModel: {
    create: jest.fn(),
  },
}));

describe("Gig Controller", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockSession: mongoose.ClientSession;

  beforeEach(() => {
    mockRequest = {
      user: { EID: "EMP000001" },
    } as unknown as Request;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    } as unknown as mongoose.ClientSession;
    jest.clearAllMocks();
  });

  describe.only("createGig", () => {
    it.only("should create a gig successfully", async () => {
      mockRequest.body = {
        title: "Test Gig",
        skills: [
          {
            skill: "React",
            weight: 0.5,
          },
          {
            skill: "Redux",
            weight: 0.6,
          },
        ],
        description: "Test Description",
        amount: 0,
        deadline: "2024-12-31",
        img: "https://link/to/img",
        rewardPoints: 2000,
      };

      const gigData = {
        GigID: "G000001",
        ...mockRequest.body,
        ManagerID: "EMP000001",
        ongoingStatus: OngoingStatus.UnAssigned,
        approvalStatus: ApprovalStatus.APPROVED,
      };

      // (Gig.create as jest.Mock).mockResolvedValue([gigData]);

      const result = await createGig(mockRequest, mockResponse, mockSession);

      expect(generateId).toHaveBeenCalledWith(IDs.GigID, mockSession);
      expect(Gig.create).toHaveBeenCalledWith([gigData], {
        session: mockSession,
      });
      expect(result).toEqual({
        status: HttpStatusCodes.CREATED,
        data: gigData,
      });
    });

    it("should handle gig creation failure", async () => {
      mockRequest.body = {
        title: "Test Gig",
        description: "Test Description",
        DID: "D000001",
      };

      (Gig.create as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(
        createGig(mockRequest, mockResponse, mockSession)
      ).rejects.toThrow("failed to create gig");
    });
  });

  describe("getAllGigs", () => {
    it("should return all gigs with filters", async () => {
      mockRequest.query = {
        DIDs: ["D000001"],
        ManagerIDs: "EMP000001",
        search: "test",
        page: "1",
        approvalStatus: "APPROVED",
      };

      const mockGigs = [
        {
          GigID: "GIG000001",
          title: "Test Gig",
          description: "Test Description",
        },
      ];

      (Gig.aggregate as jest.Mock).mockResolvedValue(mockGigs);

      const result = await getAllGigs(mockRequest);

      expect(Gig.aggregate).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockGigs,
      });
    });
  });

  describe("getGigById", () => {
    it("should return a gig by ID", async () => {
      mockRequest.params = { GigID: "GIG000001" };

      const mockGig = {
        GigID: "GIG000001",
        title: "Test Gig",
      };

      (Gig.findOne as jest.Mock).mockResolvedValue(mockGig);

      const result = await getGigById(mockRequest);

      expect(Gig.findOne).toHaveBeenCalledWith({ GigID: "GIG000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockGig,
      });
    });
  });

  describe("assignGig", () => {
    it("should assign gig successfully", async () => {
      mockRequest.body = {
        GigID: "GIG000001",
        EID: "EMP000002",
      };

      const mockGig = {
        GigID: "GIG000001",
        ManagerID: "EMP000001",
        EID: null,
      };

      (Gig.findOne as jest.Mock).mockResolvedValue(mockGig);
      (Gig.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockGig,
        EID: "EMP000002",
      });

      const result = await assignGig(mockRequest, mockResponse, mockSession);

      expect(NotificationModel.create).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: expect.objectContaining({
          GigID: "GIG000001",
          EID: "EMP000002",
        }),
      });
    });
  });

  describe("updateGigProgress", () => {
    it("should update gig progress successfully", async () => {
      mockRequest.params = { _id: "GIG000001" };
      mockRequest.files = [
        {
          originalname: "test.pdf",
          buffer: Buffer.from("test"),
        },
      ] as Express.Multer.File[];

      const mockGig = {
        GigID: "GIG000001",
        EID: "EMP000001",
      };

      (Gig.findOne as jest.Mock).mockResolvedValue(mockGig);
      (parseFile as jest.Mock).mockResolvedValue({ fileUrl: "test-url" });
      (Gig.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockGig,
        progress: ["test-url"],
      });

      const result = await updateGigProgress(
        mockRequest,
        mockResponse,
        mockSession
      );

      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: expect.objectContaining({
          GigID: "GIG000001",
          progress: ["test-url"],
        }),
      });
    });
  });
});
