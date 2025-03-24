import { Request, Response } from "express";
import mongoose from "mongoose";
import { PositionModel } from "../../models/position.model";
import { DepartmentModel } from "../../models/department.model";
import {
  createPosition,
  getAllPositions,
  deletePositionByID,
  getPositionById,
} from "../../controllers/position.controller";
import { generateId } from "../../utils/counterManager.util";
import { IDs } from "../../models/idCounter.model";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import "../mocks/mockDependencies";

jest.mock("../../models/position.model", () => ({
  PositionModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("../../utils/counterManager.util", () => ({
  generateId: jest.fn().mockResolvedValue("P0000001"),
}));

describe("Position Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockSession: mongoose.ClientSession;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
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

  describe("createPosition", () => {
    it("should create a position successfully", async () => {
      mockRequest.body = {
        title: "Software Engineer",
        description: "Engineering position",
        type: "FullTime",
        salary: 100000,
        DID: "D000001",
      } as unknown as Request;

      DepartmentModel.findOne = jest.fn().mockResolvedValue({
        DID: "D000001",
        name: "Engineering",
      });

      (PositionModel.create as jest.Mock).mockResolvedValue({
        PID: "P000001",
        ...mockRequest.body,
      });

      const result = await createPosition(
        mockRequest as Request,
        mockResponse as Response,
        mockSession
      );

      expect(generateId).toHaveBeenCalledWith(IDs.PID, mockSession);
      expect(DepartmentModel.findOne).toHaveBeenCalledWith({ DID: "D000001" });
      expect(PositionModel.create).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.CREATED,
        data: expect.objectContaining({
          PID: "P000001",
          title: "Software Engineer",
        }),
      });
    });

    it("should handle department not found", async () => {
      mockRequest.body = {
        title: "Software Engineer",
        description: "Engineering position",
        type: "FullTime",
        salary: 100000,
        DID: "D000999",
      };

      (DepartmentModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        createPosition(
          mockRequest as Request,
          mockResponse as Response,
          mockSession
        )
      ).rejects.toThrow("Department not found");
    });

    it("should handle position creation failure", async () => {
      mockRequest.body = {
        title: "Software Engineer",
        description: "Engineering position",
        type: "FullTime",
        salary: 100000,
        DID: "D000001",
      };

      DepartmentModel.findOne = jest.fn().mockResolvedValue({
        DID: "D000001",
        name: "Engineering",
      });

      (PositionModel.create as jest.Mock).mockResolvedValue(null);

      await expect(
        createPosition(
          mockRequest as Request,
          mockResponse as Response,
          mockSession
        )
      ).rejects.toThrow("Position not created");
    });
  });

  describe("getAllPositions", () => {
    it("should return all positions with filters", async () => {
      mockRequest.query = {
        types: "FullTime,PartTime",
        page: "1",
        DIDs: ["D000001"],
        search: "engineer",
      };

      const mockPositions = [
        {
          PID: "P000001",
          title: "Software Engineer",
          description: "Engineering position",
          type: "FullTime",
          DID: "D000001",
          department: {
            name: "Engineering",
            function: "Engineering",
            teamSize: 10,
          },
        },
      ];

      (PositionModel.aggregate as jest.Mock).mockResolvedValue(mockPositions);
      (PositionModel.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await getAllPositions(mockRequest as Request);

      expect(PositionModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          docs: mockPositions,
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
  });

  describe("deletePositionByID", () => {
    it("should delete position successfully", async () => {
      mockRequest.params = { ID: "P000001" };

      (PositionModel.findOne as jest.Mock).mockResolvedValue({
        PID: "P000001",
        title: "Software Engineer",
      });

      (PositionModel.deleteOne as jest.Mock).mockResolvedValue({
        acknowledged: true,
      });

      const result = await deletePositionByID(mockRequest as Request);

      expect(PositionModel.findOne).toHaveBeenCalledWith({ PID: "P000001" });
      expect(PositionModel.deleteOne).toHaveBeenCalledWith({ PID: "P000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          PID: "P000001",
          title: "Software Engineer",
        },
      });
    });

    it("should handle position not found", async () => {
      mockRequest.params = { ID: "P000999" };

      (PositionModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(deletePositionByID(mockRequest as Request)).rejects.toThrow(
        "Bad Request"
      );
    });

    it("should handle deletion failure", async () => {
      mockRequest.params = { ID: "P000001" };

      (PositionModel.findOne as jest.Mock).mockResolvedValue({
        PID: "P000001",
        title: "Software Engineer",
      });

      (PositionModel.deleteOne as jest.Mock).mockResolvedValue({
        acknowledged: false,
      });

      await expect(deletePositionByID(mockRequest as Request)).rejects.toThrow(
        "position not deleted"
      );
    });
  });

  describe("getPositionById", () => {
    it("should return position by ID successfully", async () => {
      mockRequest.params = { ID: "P000001" };

      (PositionModel.findOne as jest.Mock).mockResolvedValue({
        PID: "P000001",
        title: "Software Engineer",
      });

      const result = await getPositionById(mockRequest as Request);

      expect(PositionModel.findOne).toHaveBeenCalledWith({ PID: "P000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          PID: "P000001",
          title: "Software Engineer",
        },
      });
    });

    it("should handle position not found", async () => {
      mockRequest.params = { ID: "P000999" };

      (PositionModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getPositionById(mockRequest as Request)).rejects.toThrow(
        "Bad Request"
      );
    });
  });
});
