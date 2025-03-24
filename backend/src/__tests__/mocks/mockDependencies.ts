import { ClientSession } from "mongoose";
import { IDs } from "../../models/idCounter.model";
import { GigModel } from "../../types/gig.types";

jest.mock("../../utils/mail.util", () => ({
  sendVerificationEmail: jest.fn(),
  sendForgotPasswordMail: jest.fn(),
}));

jest.mock("../../models/notification.model", () => ({
  NotificationModel: {
    create: jest.fn(),
  },
}));

jest.mock("../../models/bid.model", () => ({
  BidModel: {
    findOne: jest.fn().mockResolvedValue({
      BidID: "B000001",
      GigID: "G000001",
    }),
  },
}));

jest.mock("../../models/userAuth.model", () => ({
  User: {
    create: jest
      .fn()
      .mockResolvedValue([{ _id: "123", email: "temp@gmail.com" }]),
    findOne: jest.fn().mockImplementation(async (filter) => {
      if (filter.email === "temp@gmail.com" || filter.EID === "EMP000001")
        return {
          EID: "EMP000001",
          email: "temp@gmail.com",
          role: "Employee",
          DID: "D000001",
        };
      return null;
    }),
    paginate: jest
      .fn()
      .mockImplementation(
        (filter, options: { offset: number; limit: number }) => {
          const employees = [
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
          ];

          return employees;
        }
      ),
    findOneAndUpdate: jest.fn().mockImplementation(
      (
        filter: { EID: string },
        update: {
          $push: { skills: { $each: { score: number; skill: string }[] } };
        },
        options: { new: boolean; upsert: boolean }
      ) => {
        if (filter.EID === "EMP000001")
          return {
            EID: filter.EID,
            skills: [{ skill: "React", score: 0.9 }],
          };
        return null;
      }
    ),
    deleteOne: jest.fn().mockImplementation((filter: { EID: string }) => {
      if (filter.EID === "EMP000001")
        return {
          acknowledged: true,
        };
      return {
        acknowledged: false,
      };
    }),
  },
  UserRole: {
    Admin: "Admin",
    Employee: "Employee",
    Manager: "Manager",
    Other: "Other",
  },
}));

jest.mock("../../utils/counterManager.util", () => ({
  generateId: jest
    .fn()
    .mockImplementation((id: IDs, session: ClientSession) => {
      if (id === IDs.EID) return "EMP000002";
      if (id === IDs.GigID) return "G000001";
      if (id === IDs.NID) return "N000001";
      if (id === IDs.BidID) return "B000001";
    }),
}));

jest.mock("../../models/department.model", () => ({
  DepartmentModel: {
    findOne: jest.fn().mockImplementation(async ({ DID }: { DID: string }) => {
      if (DID !== "D000001") return false;
      return true;
    }),
    findOneAndUpdate: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock("../../utils/password.util", () => ({
  generateRandomPassword: jest.fn().mockReturnValue("A@123456789"),
  hashPassword: jest.fn().mockReturnValue("a@987654321"),
}));

jest.mock("../../models/position.model", () => ({
  PositionModel: {
    findOne: jest.fn().mockImplementation(async ({ PID }: { PID: string }) => {
      if (PID !== "P000001") return false;
      return true;
    }),
  },
}));

jest.mock("../../database/connection", () => ({
  client: {
    hSet: jest.fn(),
    hDel: jest.fn(),
  },
}));

jest.mock("../../models/gig.model", () => ({
  Gig: {
    paginate: jest.fn().mockResolvedValue([
      {
        GigID: "G000001",
        title: "Test Gig",
        description: "Test Description",
      },
    ]),
    create: jest
      .fn()
      .mockImplementation(
        (data: GigModel[], options: { session: ClientSession }) => {
          return data;
        }
      ),
    aggregate: jest.fn().mockResolvedValue([
      {
        GigID: "G000001",
        title: "Test Gig",
        description: "Test Description",
      },
    ]),
    countDocuments: jest.fn().mockResolvedValue(1),
    findOne: jest.fn().mockResolvedValue({
      GigID: "G000001",
      title: "Test Gig",
    }),
    findOneAndUpdate: jest.fn().mockResolvedValueOnce({
      GigID: "G000001",
      ManagerID: "EMP000001",
      EID: "EMP000002",
    }),
    findById: jest.fn().mockResolvedValue({
      GigID: "G000001",
      EID: "EMP000001",
    }),
  },

  OngoingStatus: {
    UnAssigned: "UnAssigned",
    Ongoing: "Ongoing",
    Completed: "Completed",
  },
  ApprovalStatus: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  },
}));

jest.mock("../../utils/fileParser.util", () => ({
  parseFile: jest.fn(),
  generatePresignedUrl: jest
    .fn()
    .mockResolvedValue("https://presigned/url/string"),
}));

jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockReturnValue({
    send: jest.fn(),
  }),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));
