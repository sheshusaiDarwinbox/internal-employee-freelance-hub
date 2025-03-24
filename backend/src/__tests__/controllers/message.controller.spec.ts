import { Request } from "express";
import { MessageModel } from "../../models/message.model";
import { getMessages } from "../../controllers/message.controller";
import { HttpStatusCodes } from "../../utils/httpsStatusCodes.util";
import "../mocks/mockDependencies";

jest.mock("../../models/message.model", () => ({
  MessageModel: {
    find: jest.fn(),
  },
}));

describe("Message Controller", () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      params: {
        senderID: "EMP000001",
        receiverID: "EMP000002",
      },
    };
    jest.clearAllMocks();
  });

  describe("getMessages", () => {
    it("should return messages successfully", async () => {
      const mockMessages = [
        {
          SenderID: "EMP000001",
          ReceiverID: "EMP000002",
          Content: "Test message",
          Timestamp: new Date(),
        },
      ];

      (MessageModel.find as jest.Mock).mockResolvedValue(mockMessages);

      const result = await getMessages(mockRequest as Request);

      expect(MessageModel.find).toHaveBeenCalledWith({
        SenderID: "EMP000001",
        ReceiverID: "EMP000002",
      });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: mockMessages,
      });
    });

    it("should return empty array when no messages found", async () => {
      (MessageModel.find as jest.Mock).mockResolvedValue([]);

      const result = await getMessages(mockRequest as Request);

      expect(MessageModel.find).toHaveBeenCalledWith({
        SenderID: "EMP000001",
        ReceiverID: "EMP000002",
      });
      expect(result).toEqual({
        status: HttpStatusCodes.OK,
        data: [],
      });
    });
  });
});
