import { Request, Response } from "express";
import mongoose from "mongoose";
import { BidModel } from "../../models/bid.model";
import { createBid, getBidsByGig } from "../../controllers/bid.controller";
import { generateId } from "../../utils/counterManager.util";
import { IDs } from "../../models/idCounter.model";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import { Gig } from "../../models/gig.model";
// import "../mocks/mockDependencies";

jest.mock("../../models/bid.model", () => ({
  BidModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("Bid Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockSession: mongoose.ClientSession;

  beforeEach(() => {
    mockRequest = {
      user: { EID: "EMP000001" },
      body: {},
      params: {},
      query: {},
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    } as unknown as mongoose.ClientSession;
    jest.clearAllMocks();
  });

  describe("createBid", () => {
    it("should create a bid successfully", async () => {
      mockRequest.body = {
        GigID: "G000001",
        description: "Test bid description",
        EID: "EMP000001",
      };

      (BidModel.findOne as jest.Mock).mockResolvedValue(null);
      (BidModel.create as jest.Mock).mockResolvedValue([
        {
          BidID: "B000001",
          ...mockRequest.body,
        },
      ]);
      (generateId as jest.Mock).mockResolvedValue("B0000001");

      const result = await createBid(
        mockRequest as Request,
        mockResponse as Response,
        mockSession
      );

      expect(generateId).toHaveBeenCalledWith(IDs.BidID, mockSession);
      expect(BidModel.create).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.CREATED,
        data: {
          BidID: "B000001",
          GigID: "G000001",
          description: "Test bid description",
          EID: "EMP000001",
        },
      });
    });

    it("should handle existing bid", async () => {
      mockRequest.body = {
        GigID: "G000001",
        description: "Test bid description",
        EID: "EMP000001",
      };

      (BidModel.findOne as jest.Mock).mockResolvedValue({
        BidID: "B000001",
        GigID: "G000001",
      });

      const result = await createBid(
        mockRequest as Request,
        mockResponse as Response,
        mockSession
      );

      expect(result).toEqual({
        status: HttpStatusCodes.CONFLICT,
        data: {
          msg: "Already Bid for this Gig",
        },
      });
    });
  });

  describe("getBidsByGig", () => {
    it("should return bids for a gig successfully", async () => {
      mockRequest.params = { GigID: "G000001" };
      mockRequest.query = { page: "1" };

      const mockBids = [
        {
          GigID: "G000001",
          BidID: "B000001",
          description: "Test bid",
          userauth: [{ fullName: "Test User", EID: "EMP000001" }],
        },
      ];

      (Gig.findOne as jest.Mock).mockResolvedValue({
        GigID: "G000001",
        title: "Test Gig",
      });
      (BidModel.aggregate as jest.Mock).mockResolvedValue(mockBids);
      (BidModel.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await getBidsByGig(mockRequest as Request);

      expect(Gig.findOne).toHaveBeenCalledWith({ GigID: "G000001" });
      expect(BidModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          docs: mockBids,
          totalDocs: 1,
          limit: 6,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          nextPage: null,
          hasPrevPage: false,
          prevPage: null,
        },
      });
    });

    it("should handle non-existent gig", async () => {
      mockRequest.params = { GigID: "G000001" };
      mockRequest.query = { page: "1" };

      (Gig.findOne as jest.Mock).mockResolvedValue(null);

      const result = await getBidsByGig(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Gig does not exist",
        },
      });
    });

    it("should handle failed bid retrieval", async () => {
      mockRequest.params = { GigID: "G000001" };
      mockRequest.query = { page: "1" };

      (Gig.findOne as jest.Mock).mockResolvedValue({
        GigID: "G000001",
        title: "Test Gig",
      });
      (BidModel.aggregate as jest.Mock).mockResolvedValue(null);

      const result = await getBidsByGig(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        data: {
          msg: "Failed to retreive bids",
        },
      });
    });
  });
});
