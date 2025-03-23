import { Request, Response } from "express";
import mongoose from "mongoose";
import "./mocks/mockDependencies";
import { Gig } from "../models/gig.model";
import { sendVerificationEmail } from "../utils/mail.util";
import { parseFile } from "../utils/fileParser.util";

import {
  createUser,
  updateUserSkills,
  getUserById,
  deleteUserByID,
  getAllUsers,
  getAllUsersDetails,
  getEmployeesUnderManager,
  getProfile,
  updateProfile,
  getGigsByUser,
  uploadProfileImg,
  resendVerifyMail,
} from "../controllers/user.controller";
import { User } from "../models/userAuth.model";
import { generateId } from "../utils/counterManager.util";
import { IDs } from "../models/idCounter.model";
import { generateRandomPassword } from "../utils/password.util";
import { DepartmentModel } from "../models/department.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("createUser POST /api/users/create", () => {
    const mockRequest = {
      body: [
        {
          DID: "D000001",
          PID: "P000001",
          role: "Employee",
          ManagerID: "EMP000001",
          email: "temp2@gmail.com",
          skills: [{ skill: "React", score: 0.8 }],
        },
      ],
    } as unknown as Request;

    const mockResponse = {} as Response;
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    } as unknown as mongoose.ClientSession;
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should create a user successfully", async () => {
      const result = await createUser(mockRequest, mockResponse, mockSession);

      expect(result).toEqual({
        status: 201,
        data: expect.any(Array),
      });
      expect(User.findOne).toHaveBeenCalledWith({
        email: "temp2@gmail.com",
      });
      expect(generateId).toHaveBeenCalledWith(IDs.EID, mockSession);
      expect(generateRandomPassword).toHaveBeenCalled();
      expect(DepartmentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { DID: "D000001" },
        { $inc: { teamSize: 1 } },
        { session: mockSession, new: true }
      );
    });

    it("should return error when email already exists", async () => {
      const mockRequest = {
        body: [
          {
            DID: "D000001",
            PID: "P000001",
            role: "Employee",
            ManagerID: "EMP000001",
            email: "temp@gmail.com",
            skills: [{ skill: "React", score: 0.8 }],
          },
        ],
      } as unknown as Request;

      const mockResponse = {} as Response;
      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      } as unknown as mongoose.ClientSession;
      // mockRequest.body.email = "temp@gmail.com";
      const result = await createUser(mockRequest, mockResponse, mockSession);

      expect(result.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(result.data).toEqual({
        msg: "Department or Position not found or email already exists",
      });

      expect(generateId).not.toHaveBeenCalled();
      expect(generateRandomPassword).not.toHaveBeenCalled();
      expect(DepartmentModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("should return error when Position not exists", async () => {
      const mockRequest = {
        body: [
          {
            DID: "D000001",
            PID: "P000009",
            role: "Employee",
            ManagerID: "EMP000001",
            email: "temp@gmail.com",
            skills: [{ skill: "React", score: 0.8 }],
          },
        ],
      } as unknown as Request;

      const mockResponse = {} as Response;
      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      } as unknown as mongoose.ClientSession;

      const result = await createUser(mockRequest, mockResponse, mockSession);

      expect(result.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(result.data).toEqual({
        msg: "Department or Position not found or email already exists",
      });

      expect(generateId).not.toHaveBeenCalled();
      expect(generateRandomPassword).not.toHaveBeenCalled();
      expect(DepartmentModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("should return error when Department not exists", async () => {
      const mockRequest = {
        body: [
          {
            DID: "D000008",
            PID: "P000001",
            role: "Employee",
            ManagerID: "EMP000001",
            email: "temp@gmail.com",
            skills: [{ skill: "React", score: 0.8 }],
          },
        ],
      } as unknown as Request;

      const mockResponse = {} as Response;
      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      } as unknown as mongoose.ClientSession;

      const result = await createUser(mockRequest, mockResponse, mockSession);

      expect(result.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(result.data).toEqual({
        msg: "Department or Position not found or email already exists",
      });

      expect(generateId).not.toHaveBeenCalled();
      expect(generateRandomPassword).not.toHaveBeenCalled();
      expect(DepartmentModel.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe("update user skills POST /api/users/update-user-skills/:EID", () => {
    it("should update user skills successfully", async () => {
      const mockRequest = {
        body: {
          skills: [{ skill: "React", score: 0.9 }],
        },
        params: { EID: "EMP000001" },
      } as unknown as Request;

      const result = await updateUserSkills(mockRequest as Request);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { EID: "EMP000001" },
        { $push: { skills: { $each: [{ score: 0.9, skill: "React" }] } } },
        { new: true, upsert: true }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          EID: "EMP000001",
          skills: [{ skill: "React", score: 0.9 }],
        },
      });
    });

    it("should return error when user not exist", async () => {
      const mockRequest = {
        body: {
          skills: [{ skill: "React", score: 0.9 }],
        },
        params: { EID: "EMP000008" },
      } as unknown as Request;

      const result = await updateUserSkills(mockRequest as Request);

      expect(User.findOneAndUpdate).not.toHaveBeenCalled(),
        expect(result).toEqual({
          status: HttpStatusCodes.BAD_REQUEST,
          data: {
            msg: "user not found",
          },
        });
    });
  });

  describe("get user by ID GET /api/users/get-user/:ID", () => {
    it("should return user details successfully", async () => {
      const mockRequest = {
        body: {
          skills: [{ skill: "React", score: 0.9 }],
        },
        params: { ID: "EMP000001" },
      } as unknown as Request;

      const result = await getUserById(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ EID: "EMP000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          EID: "EMP000001",
          email: "temp@gmail.com",
          role: "Employee",
        },
      });
    });

    it("should return error if user not found", async () => {
      const mockRequest = {
        body: {
          skills: [{ skill: "React", score: 0.9 }],
        },
        params: { ID: "EMP000008" },
      } as unknown as Request;

      const result = await getUserById(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ EID: "EMP000008" });
      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "user not found",
        },
      });
    });
  });

  describe("delete user by ID  DELETE /api/user/:ID", () => {
    it("should delete user successfully", async () => {
      const mockRequest = {
        params: { ID: "EMP000001" },
      } as unknown as Request;

      const result = await deleteUserByID(mockRequest);

      expect(User.deleteOne).toHaveBeenCalledWith({ EID: "EMP000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          msg: "user deleted successfully",
        },
      });
    });

    it("should return error if user not exist", async () => {
      const mockRequest = {
        params: { ID: "EMP000008" },
      } as unknown as Request;

      const result = await deleteUserByID(mockRequest);

      expect(User.deleteOne).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "user not found",
        },
      });
    });
  });

  describe("get all users GET /api/users/", () => {
    it("should return all users successfully", async () => {
      const mockRequest = {
        query: {
          types: "Admin,Manager,Employee",
          page: 1,
          search: "",
        },
      } as unknown as Request;

      const result = await getAllUsers(mockRequest);

      expect(User.paginate).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: [
          {
            EID: "EMP000001",
            email: "temp1@gmail.com",
            role: "Employee",
          },
          {
            EID: "EMP000002",
            email: "temp2@gmail.com",
            role: "Manager",
          },
          {
            EID: "EMP000000",
            email: "temp3@gmail.com",
            role: "Manager",
          },
        ],
      });
    });
  });
  describe("get all users details GET /api/users/users-details", () => {
    it("should return all user details successfully", async () => {
      const mockRequest = {
        query: {
          types: "Admin,Manager",
          page: 1,
          search: "temp",
        },
      } as unknown as Request;

      (User.paginate as jest.Mock).mockResolvedValue({
        docs: [
          {
            EID: "EMP000001",
            email: "temp1@gmail.com",
            role: "Admin",
          },
          {
            EID: "EMP000002",
            email: "temp2@gmail.com",
            role: "Manager",
          },
        ],
        totalDocs: 2,
        limit: 6,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      const result = await getAllUsersDetails(mockRequest);

      expect(User.paginate).toHaveBeenCalled();
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          docs: [
            {
              EID: "EMP000001",
              email: "temp1@gmail.com",
              role: "Admin",
            },
            {
              EID: "EMP000002",
              email: "temp2@gmail.com",
              role: "Manager",
            },
          ],
          totalDocs: 2,
          limit: 6,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    });
  });

  describe("get employees under manager GET /api/users/users-under-manager", () => {
    it("should return employees under a manager successfully", async () => {
      const mockRequest = {
        user: { EID: "EMP000002" },
        query: {
          page: 1,
        },
      } as unknown as Request;

      (User.paginate as jest.Mock).mockResolvedValue({
        docs: [
          {
            EID: "EMP000003",
            email: "temp3@gmail.com",
            role: "Employee",
          },
        ],
        totalDocs: 1,
        limit: 6,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      const result = await getEmployeesUnderManager(mockRequest);

      expect(User.paginate).toHaveBeenCalledWith(
        { ManagerID: "EMP000002" },
        { offset: 0, limit: 6 }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          docs: [
            {
              EID: "EMP000003",
              email: "temp3@gmail.com",
              role: "Employee",
            },
          ],
          totalDocs: 1,
          limit: 6,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    });
  });

  describe("get profile GET /api/users/profile", () => {
    it("should return user profile successfully", async () => {
      const mockRequest = {
        user: { EID: "EMP000001" },
      } as unknown as Request;

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        email: "temp1@gmail.com",
        role: "Employee",
      });

      const result = await getProfile(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ EID: "EMP000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          EID: "EMP000001",
          email: "temp1@gmail.com",
          role: "Employee",
        },
      });
    });
  });

  describe("update profile POST /api/users/update-profile", () => {
    it("should update user profile successfully", async () => {
      const mockRequest = {
        user: { EID: "EMP000001" },
        body: {
          phone: "1234567890",
          gender: "Male",
        },
      } as unknown as Request;

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        phone: "9876543210",
        gender: "Female",
      });

      (User.findOneAndUpdate as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        phone: "1234567890",
        gender: "Male",
      });

      const result = await updateProfile(mockRequest);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { EID: "EMP000001" },
        {
          $set: {
            phone: "1234567890",
            gender: "Male",
          },
        },
        { upsert: true }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          EID: "EMP000001",
          phone: "1234567890",
          gender: "Male",
        },
      });
    });
  });

  describe("getGigsByUser GET /api/users/my-gigs", () => {
    it("should return gigs for the user successfully", async () => {
      const mockRequest = {
        user: { EID: "EMP000001" },
        query: {
          page: 1,
          search: "",
        },
      } as unknown as Request;

      const mockGigs = {
        docs: [
          {
            GigID: "GIG000001",
            title: "Test Gig",
            description: "Test Description",
            ongoingStatus: "Ongoing",
          },
        ],
        totalDocs: 1,
        limit: 6,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        role: "Employee",
      });

      (Gig.paginate as jest.Mock).mockResolvedValue(mockGigs);

      const result = await getGigsByUser(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ EID: "EMP000001" });
      expect(Gig.paginate).toHaveBeenCalledWith(
        { EID: "EMP000001" },
        { offset: 0, limit: 6 }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockGigs,
      });
    });

    it("should return error if user is not found", async () => {
      const mockRequest = {
        user: { EID: "EMP000001" },
        query: {
          page: 1,
          search: "",
        },
      } as unknown as Request;

      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await getGigsByUser(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ EID: "EMP000001" });
      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        message: "userNotfound",
      });
    });
  });

  // Test for uploadProfileImg
  describe("uploadProfileImg POST /api/users/upload-img", () => {
    it("should upload profile image successfully", async () => {
      const mockRequest = {
        user: { EID: "EMP000001" },
        file: {
          originalname: "profile.jpg",
          buffer: Buffer.from("test"),
        },
      } as unknown as Request;

      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      } as unknown as mongoose.ClientSession;

      (parseFile as jest.Mock).mockResolvedValue({
        fileUrl: "https://example.com/profile.jpg",
      });

      (User.findOneAndUpdate as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        img: "https://example.com/profile.jpg",
      });

      const result = await uploadProfileImg(
        mockRequest,
        {} as Response,
        mockSession
      );

      expect(parseFile).toHaveBeenCalledWith(mockRequest);
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { EID: "EMP000001" },
        { $set: { img: "https://example.com/profile.jpg" } },
        { upsert: true, session: mockSession }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          fileUrl: "https://presigned/url/string",
        },
      });
    });

    it("should return error if file upload fails", async () => {
      const mockRequest = {
        user: { EID: "EMP000001" },
        file: null,
      } as unknown as Request;

      (parseFile as jest.Mock).mockResolvedValue(null);

      await expect(
        uploadProfileImg(
          mockRequest,
          {} as Response,
          {} as mongoose.ClientSession
        )
      ).rejects.toThrow("failed to upload img");
    });
  });

  // Test for resendVerifyMail
  describe("resendVerifyMail POST /api/users/resend-verify-mail", () => {
    it("should resend verification email successfully", async () => {
      const mockRequest = {
        body: {
          email: "temp@gmail.com",
        },
      } as unknown as Request;

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        email: "temp@gmail.com",
        verified: false,
        _id: "123",
      });

      const mockSendVerificationEmail = jest.fn();
      (sendVerificationEmail as jest.Mock).mockImplementation(
        mockSendVerificationEmail
      );

      const result = await resendVerifyMail(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ email: "temp@gmail.com" });
      expect(sendVerificationEmail).toHaveBeenCalledWith({
        EID: "EMP000001",
        email: "temp@gmail.com",
        _id: "123",
        password: "A@123456789",
      });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          msg: "verification mail sent successfully",
        },
      });
    });

    it("should return error if user is already verified", async () => {
      const mockRequest = {
        body: {
          email: "temp@gmail.com",
        },
      } as unknown as Request;

      (User.findOne as jest.Mock).mockResolvedValue({
        EID: "EMP000001",
        email: "temp@gmail.com",
        verified: true,
      });

      const result = await resendVerifyMail(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ email: "temp@gmail.com" });
      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          message: "User already verified",
        },
      });
    });

    it("should return error if user is not found", async () => {
      const mockRequest = {
        body: {
          email: "temp@gmail.com",
        },
      } as unknown as Request;

      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await resendVerifyMail(mockRequest);

      expect(User.findOne).toHaveBeenCalledWith({ email: "temp@gmail.com" });
      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          message: "User not found",
        },
      });
    });
  });
});
