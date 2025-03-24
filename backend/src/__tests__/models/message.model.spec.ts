import mongoose from "mongoose";
import { messageSchema } from "../../models/message.model";

describe("Message Model", () => {
  let modelSpy: jest.SpyInstance;

  beforeAll(() => {
    modelSpy = jest.spyOn(mongoose, "model").mockReturnValue({} as any);
  });

  afterAll(() => {
    modelSpy.mockRestore();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("messageSchema", () => {
    it("should define the message schema with expected properties", () => {
      const messageObj = (messageSchema as any).obj;

      expect(messageObj.SenderID.type).toBe(String);
      expect(messageObj.SenderID.required).toBe(true);

      expect(messageObj.ReceiverID.type).toBe(String);
      expect(messageObj.ReceiverID.required).toBe(true);

      expect(messageObj.Content.type).toBe(String);
      expect(messageObj.Content.required).toBe(true);

      expect(messageObj.Timestamp.type).toBe(Date);
      expect(messageObj.Timestamp.default).toBeDefined();
    });
  });
});
