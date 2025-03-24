import { Request, Response } from "express";
import mongoose from "mongoose";
import { DepartmentModel } from "../../models/department.model";
import "../mocks/mockDependencies";
import {
  createDepartment,
  getAllDepartments,
  deleteDepartmentByID,
  getDepartmentByID,
  assignManagerToDepartment,
} from "../../controllers/department.controller";
import { User } from "../../models/userAuth.model";
import { generateId } from "../../utils/counterManager.util";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import { IDs } from "../../models/idCounter.model";
import "../mocks/mockDependencies";

jest.mock("../../models/department.model", () => ({
  DepartmentModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    updateOne: jest.fn(),
    paginate: jest.fn(),
  },
}));

jest.mock("../../models/userAuth.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../utils/counterManager.util", () => ({
  generateId: jest.fn().mockResolvedValue("D000001"),
}));

describe("Department Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockSession: mongoose.ClientSession;

  beforeEach(() => {
    mockRequest = {};
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

  describe("createDepartment", () => {
    it("should create a department successfully", async () => {
      mockRequest.body = {
        name: "Test Department",
        description: "Test Description",
        function: "Engineering",
        teamSize: 0,
      };

      const departmentData = {
        ...mockRequest.body,
        DID: "D000001",
      };

      (DepartmentModel.create as jest.Mock).mockResolvedValue(departmentData);

      const result = await createDepartment(
        mockRequest as Request,
        mockResponse as Response,
        mockSession
      );

      expect(generateId).toHaveBeenCalledWith(IDs.DID, mockSession);
      expect(DepartmentModel.create).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: departmentData,
      });
    });

    it("should handle department creation failure", async () => {
      mockRequest.body = {
        name: "Test Department",
        description: "Test Description",
        function: "Engineering",
        teamSize: 0,
      };

      (DepartmentModel.create as jest.Mock).mockResolvedValue(null);

      await expect(
        createDepartment(
          mockRequest as Request,
          mockResponse as Response,
          mockSession
        )
      ).rejects.toThrow("Server Error");
    });
  });

  describe("getAllDepartments", () => {
    it("should return all departments with pagination", async () => {
      mockRequest.query = {
        page: "1",
        functions: "Engineering,Product",
        search: "test",
      };

      const mockDepartments = {
        docs: [
          {
            DID: "D000001",
            name: "Test Department",
            function: "Engineering",
          },
        ],
        totalDocs: 1,
        limit: 6,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (DepartmentModel.paginate as jest.Mock).mockResolvedValue(
        mockDepartments
      );

      const result = await getAllDepartments(mockRequest as Request);

      expect(DepartmentModel.paginate).toHaveBeenCalledWith(
        expect.any(Object),
        { offset: 0, limit: 6 }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockDepartments,
      });
    });
  });

  describe("deleteDepartmentByID", () => {
    it("should delete department successfully", async () => {
      mockRequest.params = { ID: "D000001" };

      (DepartmentModel.findOne as jest.Mock).mockResolvedValue({
        DID: "D000001",
        name: "Test Department",
      });
      (DepartmentModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const result = await deleteDepartmentByID(mockRequest as Request);

      expect(DepartmentModel.findOne).toHaveBeenCalledWith({ DID: "D000001" });
      expect(DepartmentModel.deleteOne).toHaveBeenCalledWith({
        DID: "D000001",
      });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          DID: "D000001",
          name: "Test Department",
        },
      });
    });

    it("should handle department not found", async () => {
      mockRequest.params = { ID: "D000001" };

      (DepartmentModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        deleteDepartmentByID(mockRequest as Request)
      ).rejects.toThrow("Bad Request");
    });

    it("should handle deletion failure", async () => {
      mockRequest.params = { ID: "D000001" };

      (DepartmentModel.findOne as jest.Mock).mockResolvedValue({
        DID: "D000001",
        name: "Test Department",
      });
      (DepartmentModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(
        deleteDepartmentByID(mockRequest as Request)
      ).rejects.toThrow("Department not deleted");
    });
  });

  describe("getDepartmentByID", () => {
    it("should return department by ID successfully", async () => {
      mockRequest.params = { ID: "D000001" };

      (DepartmentModel.findOne as jest.Mock).mockResolvedValue({
        DID: "D000001",
        name: "Test Department",
      });

      const result = await getDepartmentByID(mockRequest as Request);

      expect(DepartmentModel.findOne).toHaveBeenCalledWith({ DID: "D000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          DID: "D000001",
          name: "Test Department",
        },
      });
    });

    it("should handle department not found", async () => {
      mockRequest.params = { ID: "D000001" };

      (DepartmentModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getDepartmentByID(mockRequest as Request)).rejects.toThrow(
        "Bad Request"
      );
    });
  });

  describe("assignManagerToDepartment", () => {
    it("should assign manager to department successfully", async () => {
      mockRequest.body = {
        DID: "D000001",
        EID: "EMP000001",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        DID: "D000001",
      });
      (DepartmentModel.findOne as jest.Mock).mockResolvedValue({
        DID: "D000001",
        name: "Test Department",
      });
      (DepartmentModel.updateOne as jest.Mock).mockResolvedValue({
        modifiedCount: 1,
      });

      const result = await assignManagerToDepartment(mockRequest as Request);

      expect(User.findOne).toHaveBeenCalledWith({ EID: "EMP000001" });
      expect(DepartmentModel.findOne).toHaveBeenCalledWith({ DID: "D000001" });
      expect(DepartmentModel.updateOne).toHaveBeenCalledWith(
        { DID: "D000001" },
        { $set: { ManagerID: "EMP000001" } }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: { modifiedCount: 1 },
      });
    });

    it("should handle invalid assignment conditions", async () => {
      mockRequest.body = {
        DID: "D000001",
        EID: "EMP000001",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        assignManagerToDepartment(mockRequest as Request)
      ).rejects.toThrow(
        "user or department not found OR department already assigned with a manager OR user does not belong to given Department"
      );
    });

    it("should handle department already has manager", async () => {
      mockRequest.body = {
        DID: "D000001",
        EID: "EMP000001",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        DID: "D000001",
      });
      (DepartmentModel.findOne as jest.Mock).mockResolvedValue({
        DID: "D000001",
        name: "Test Department",
        ManagerID: "EMP000002",
      });

      await expect(
        assignManagerToDepartment(mockRequest as Request)
      ).rejects.toThrow(
        "user or department not found OR department already assigned with a manager OR user does not belong to given Department"
      );
    });

    it("should handle user from different department", async () => {
      mockRequest.body = {
        DID: "D000001",
        EID: "EMP000001",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        DID: "D000002",
      });
      (DepartmentModel.findOne as jest.Mock).mockResolvedValue({
        DID: "D000001",
        name: "Test Department",
      });

      await expect(
        assignManagerToDepartment(mockRequest as Request)
      ).rejects.toThrow(
        "user or department not found OR department already assigned with a manager OR user does not belong to given Department"
      );
    });
  });
});
