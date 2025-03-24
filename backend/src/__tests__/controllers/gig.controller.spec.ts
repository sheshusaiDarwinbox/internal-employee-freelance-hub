import { Request, Response } from "express";
import mongoose from "mongoose";
import "../mocks/mockDependencies";
import {
  createGig,
  getAllGigs,
  getGigById,
  assignGig,
  getMyGigs,
  updateGigProgress,
} from "../../controllers/gig.controller";
import { Gig } from "../../models/gig.model";
import { NotificationModel } from "../../models/notification.model";
import { generateId } from "../../utils/counterManager.util";
import { IDs } from "../../models/idCounter.model";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import { parseFile } from "../../utils/fileParser.util";

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
      const result = await createGig(mockRequest, mockResponse, mockSession);

      expect(generateId).toHaveBeenCalledWith(IDs.GigID, mockSession);
      expect(Gig.create).toHaveBeenCalled();
      expect(result.status).toEqual(HttpStatusCodes.CREATED);
    });

    it.only("should handle gig creation failure", async () => {
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

      (Gig.create as jest.Mock).mockResolvedValue([]);

      const result = await createGig(mockRequest, mockResponse, mockSession);

      expect(result).toEqual({
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        data: {
          msg: "failed to create gig",
        },
      });
    });
  });

  describe("getAllGigs", () => {
    it.only("should return all gigs with filters", async () => {
      mockRequest.query = {
        DIDs: ["D000001"],
        ManagerIDs: "EMP000001",
        search: "",
        page: "1",
        approvalStatus: "APPROVED",
      };

      const mockGigs = [
        {
          GigID: "G000001",
          title: "Test Gig",
          description: "Test Description",
        },
      ];

      const result = await getAllGigs(mockRequest);

      expect(Gig.aggregate).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          docs: mockGigs,
          totalDocs: 1,
          page: 1,
          limit: 6,
          totalPages: 1,
          hasNextPage: false,
          nextPage: null,
          hasPrevPage: false,
          prevPage: null,
        },
      });
    });
  });

  describe("getGigById", () => {
    it.only("should return a gig by ID", async () => {
      mockRequest.params = { GigID: "G000001" };

      const mockGig = {
        GigID: "G000001",
        title: "Test Gig",
      };

      const result = await getGigById(mockRequest);

      expect(Gig.findOne).toHaveBeenCalledWith({ GigID: "G000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockGig,
      });
    });
  });

  describe("assignGig", () => {
    it.only("should assign gig successfully", async () => {
      mockRequest.body = {
        GigID: "G000001",
        EID: "EMP000002",
        BidID: "B000001",
      };

      const mockGig = {
        GigID: "G000001",
        ManagerID: "EMP000001",
        EID: null,
      };

      (Gig.findOne as jest.Mock).mockResolvedValue(mockGig);

      const result = await assignGig(mockRequest, mockResponse, mockSession);

      expect(NotificationModel.create).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: expect.objectContaining({
          GigID: "G000001",
          EID: "EMP000002",
        }),
      });
    });
  });

  describe("updateGigProgress", () => {
    it.only("should update gig progress successfully", async () => {
      mockRequest.params = { _id: "G000001" };
      mockRequest.body = {
        subject: "test Subject",
        description: "test description",
        work_percentage: 40,
      };
      mockRequest.files = [
        {
          originalname: "test.pdf",
          buffer: Buffer.from("test"),
        },
      ] as Express.Multer.File[];

      const mockGig = {
        GigID: "G000001",
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
        data: {
          GigID: "G000001",
          EID: "EMP000001",
          progress: ["test-url"],
        },
      });
    });
  });

  describe("getMyGigs", () => {
    it.only("should return all the gigs of a manager", async () => {
      mockRequest.query = {
        type: "Ongoing",
        search: "",
      };

      const result = await getMyGigs(mockRequest);
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: [
          {
            GigID: "G000001",
            title: "Test Gig",
            description: "Test Description",
          },
        ],
      });
    });
  });
});
