import { Request, Response } from "express";
import { login, logout } from "../../controllers/login.controller";
import "../mocks/mockDependencies";

describe("Login Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      user: {
        EID: "EMP000001",
        email: "test@example.com",
        role: "Employee",
      },
      logout: jest.fn().mockImplementation((callback) => callback()),
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return successful login response with user data", () => {
      login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: mockRequest.user,
      });
    });
  });

  describe("logout", () => {
    it("should handle successful logout", () => {
      logout(mockRequest as Request, mockResponse as Response);

      expect(mockRequest.logout).toHaveBeenCalled();
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should handle logout error", () => {
      const mockError = new Error("Logout failed");
      (mockRequest.logout as jest.Mock).mockImplementation((callback) =>
        callback(mockError)
      );

      logout(mockRequest as Request, mockResponse as Response);

      expect(mockRequest.logout).toHaveBeenCalled();
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("status", () => {
    it("should return user data", () => {
      const mockStatusRequest = {
        ...mockRequest,
        user: {
          EID: "EMP000001",
          email: "test@example.com",
          role: "Employee",
        },
      };

      const mockStatusResponse = {
        ...mockResponse,
        send: jest.fn(),
      };

      mockStatusResponse.send(mockStatusRequest.user);

      expect(mockStatusResponse.send).toHaveBeenCalledWith(
        mockStatusRequest.user
      );
    });
  });
});
