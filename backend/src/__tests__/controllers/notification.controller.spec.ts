import { Request } from "express";
import { NotificationModel } from "../../models/notification.model";
import {
  getNotifications,
  markAsRead,
} from "../../controllers/notifications.controller";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import "../mocks/mockDependencies";

jest.mock("../../models/notification.model", () => ({
  NotificationModel: {
    paginate: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe("Notifications Controller", () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      user: { EID: "EMP000001" },
      query: {},
      body: {},
    } as unknown as Request;
    jest.clearAllMocks();
  });

  describe("getNotifications", () => {
    it("should return notifications successfully", async () => {
      const mockNotifications = {
        docs: [
          {
            NID: "N000001",
            EID: "EMP000001",
            description: "Test notification",
            read: false,
          },
        ],
        totalDocs: 1,
        limit: 6,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (NotificationModel.paginate as jest.Mock).mockResolvedValue(
        mockNotifications
      );

      const result = await getNotifications(mockRequest as Request);

      expect(NotificationModel.paginate).toHaveBeenCalledWith(
        { EID: "EMP000001", read: false },
        {
          offset: 0,
          limit: 6,
          sort: { createdAt: -1 },
        }
      );
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockNotifications,
      });
    });

    it("should handle no notifications found", async () => {
      (NotificationModel.paginate as jest.Mock).mockResolvedValue(null);

      const result = await getNotifications(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "No notifications found",
        },
      });
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read successfully", async () => {
      mockRequest.body = { NID: "N000001" };

      (NotificationModel.findOne as jest.Mock).mockResolvedValue({
        NID: "N000001",
        read: false,
      });

      (NotificationModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        NID: "N000001",
        read: true,
      });

      const result = await markAsRead(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: {
          msg: "Notification marked as read",
        },
      });
    });

    it("should handle notification not found", async () => {
      mockRequest.body = { NID: "N000001" };

      (NotificationModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await markAsRead(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Notification not found OR already read",
        },
      });
    });

    it("should handle already read notification", async () => {
      mockRequest.body = { NID: "N000001" };

      (NotificationModel.findOne as jest.Mock).mockResolvedValue({
        NID: "N000001",
        read: true,
      });

      const result = await markAsRead(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Notification not found OR already read",
        },
      });
    });

    it("should handle update failure", async () => {
      mockRequest.body = { NID: "N000001" };

      (NotificationModel.findOne as jest.Mock).mockResolvedValue({
        NID: "N000001",
        read: false,
      });

      (NotificationModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await markAsRead(mockRequest as Request);

      expect(result).toEqual({
        status: HttpStatusCodes.BAD_REQUEST,
        data: {
          msg: "Failed to mark notification as read",
        },
      });
    });
  });
});
