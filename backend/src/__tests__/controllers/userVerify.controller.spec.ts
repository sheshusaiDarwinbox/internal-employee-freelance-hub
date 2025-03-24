import { Request, Response } from "express";
import { UserVerification } from "../../models/userVerification.model";
import { User } from "../../models/userAuth.model";
import { forgotPassword } from "../../models/forgotPassword.model";
import { comparePassword, hashPassword } from "../../utils/password.util";
import {
  verifyUser,
  handleForgotPassword,
  forgotVerifyStringHandler,
} from "../../controllers/userVerify.controller";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import { readFile } from "fs/promises";
import "../mocks/mockDependencies";

// Mock express Router
jest.mock("express", () => ({
  ...jest.requireActual("express"),
  Router: () => ({
    get: jest.fn(),
    post: jest.fn(),
    use: jest.fn(),
  }),
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
    paginate: jest.fn().mockImplementation(() => {
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
    }),
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
    updateOne: jest.fn().mockResolvedValue({
      EID: "EMP000001",
      email: "temp@gmail.com",
      role: "Employee",
    }),
  },
  UserRole: {
    Admin: "Admin",
    Employee: "Employee",
    Manager: "Manager",
    Other: "Other",
  },
}));
jest.mock("fs/promises", () => ({
  readFile: jest.fn().mockResolvedValue("<html>Test HTML Content</html>"),
}));

jest.mock("../../models/userVerification.model", () => ({
  UserVerification: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

jest.mock("../../models/forgotPassword.model", () => ({
  forgotPassword: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

jest.mock("../../utils/password.util", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock("../../utils/mail.util", () => ({
  sendForgotPasswordMail: jest.fn().mockImplementation((_data, res) => {
    res.status(200).json({ msg: "Forgot mail sent" });
    return Promise.resolve();
  }),
}));

jest.mock("../../utils/session.util", () => ({
  sessionHandler: (fn: any) => fn,
}));

describe("User Verify Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("verifyUser", () => {
    it("should verify user successfully", async () => {
      mockRequest.params = {
        ID: "testId",
        verifyString: "testVerifyString",
      };

      (UserVerification.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        verifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      //   (User.findOne as jest.Mock).mockResolvedValue({
      //     email: "temp@gmail.com",
      //   });
      //   (User.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });
      (UserVerification.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const result = await verifyUser(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: "<html>Test HTML Content</html>",
      });
      expect(readFile).toHaveBeenCalledWith(
        expect.stringContaining("accountVerified.html"),
        "utf-8"
      );
    });

    it("should handle non-existent verification info", async () => {
      mockRequest.params = {
        ID: "testId",
        verifyString: "testVerifyString",
      };

      (UserVerification.findOne as jest.Mock).mockResolvedValue(null);

      await expect(verifyUser(mockRequest as Request)).rejects.toThrow(
        "Bad Request"
      );
    });

    it("should handle invalid verify string", async () => {
      mockRequest.params = {
        ID: "testId",
        verifyString: "testVerifyString",
      };

      (UserVerification.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        verifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(verifyUser(mockRequest as Request)).rejects.toThrow(
        "Invalid verifyString"
      );
    });

    it("should handle non-existent user", async () => {
      mockRequest.params = {
        ID: "testId",
        verifyString: "testVerifyString",
      };

      (UserVerification.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        verifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(verifyUser(mockRequest as Request)).rejects.toThrow(
        "Invalid user"
      );
    });

    it("should handle failed user verification update", async () => {
      mockRequest.params = {
        ID: "testId",
        verifyString: "testVerifyString",
      };

      (UserVerification.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        verifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "temp@gmail.com",
      });
      (User.updateOne as jest.Mock).mockResolvedValue(null);

      await expect(verifyUser(mockRequest as Request)).rejects.toThrow(
        "User Not verified"
      );
    });
  });

  describe("handleForgotPassword", () => {
    it("should handle forgot password request successfully", async () => {
      mockRequest.body = {
        email: "temp@gmail.com",
        redirectUrl: "http://example.com/reset",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        email: "temp@gmail.com",
      });

      await handleForgotPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: "temp@gmail.com" });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: "Forgot mail sent",
      });
    });

    it("should handle non-existent email", async () => {
      mockRequest.body = {
        email: "nonexistent@example.com",
        redirectUrl: "http://example.com/reset",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        handleForgotPassword(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow("Email not found");
    });
  });

  describe("forgotVerifyStringHandler", () => {
    it("should handle password reset successfully", async () => {
      mockRequest.params = {
        ID: "testId",
        forgotVerifyString: "testVerifyString",
      };
      mockRequest.body = {
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      };

      (forgotPassword.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        forgotVerifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "temp@gmail.com",
      });
      (hashPassword as jest.Mock).mockResolvedValue("newHashedPassword");
      (User.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });
      (forgotPassword.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      await forgotVerifyStringHandler(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "<html>Test HTML Content</html>"
      );
    });

    it("should handle password mismatch", async () => {
      mockRequest.params = {
        ID: "testId",
        forgotVerifyString: "testVerifyString",
      };
      mockRequest.body = {
        newPassword: "NewPassword123!",
        confirmPassword: "DifferentPassword123!",
      };

      await expect(
        forgotVerifyStringHandler(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow("Passwords must be same");
    });

    it("should handle non-existent forgot password info", async () => {
      mockRequest.params = {
        ID: "testId",
        forgotVerifyString: "testVerifyString",
      };
      mockRequest.body = {
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      };

      (forgotPassword.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        forgotVerifyStringHandler(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow("Bad Request");
    });

    it("should handle invalid forgot verify string", async () => {
      mockRequest.params = {
        ID: "testId",
        forgotVerifyString: "testVerifyString",
      };
      mockRequest.body = {
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      };

      (forgotPassword.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        forgotVerifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        forgotVerifyStringHandler(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow("Invalid forgot verify string");
    });

    it("should handle non-existent user during password reset", async () => {
      mockRequest.params = {
        ID: "testId",
        forgotVerifyString: "testVerifyString",
      };
      mockRequest.body = {
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      };

      (forgotPassword.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        forgotVerifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        forgotVerifyStringHandler(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow("Invalid user");
    });

    it("should handle failed password update", async () => {
      mockRequest.params = {
        ID: "testId",
        forgotVerifyString: "testVerifyString",
      };
      mockRequest.body = {
        newPassword: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      };

      (forgotPassword.findOne as jest.Mock).mockResolvedValue({
        _id: "testId",
        forgotVerifyString: "hashedString",
        email: "temp@gmail.com",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "temp@gmail.com",
      });
      (hashPassword as jest.Mock).mockResolvedValue("newHashedPassword");
      (User.updateOne as jest.Mock).mockResolvedValue(null);

      await expect(
        forgotVerifyStringHandler(
          mockRequest as Request,
          mockResponse as Response
        )
      ).rejects.toThrow("Password reset failed");
    });
  });
});
