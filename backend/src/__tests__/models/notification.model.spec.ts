import mongoose from "mongoose";
import { notificationSchema } from "../../models/notification.model";

jest.mock("mongoose-paginate-v2", () => jest.fn());

describe("Notification Model", () => {
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

  describe("notificationSchema", () => {
    it("should define the notification schema with expected properties", () => {
      const notificationObj = (notificationSchema as any).obj;

      expect(notificationObj.NID.type).toBe(String);
      expect(notificationObj.NID.required).toBe(true);
      expect(notificationObj.NID.index).toBe(true);
      expect(notificationObj.NID.unique).toBe(true);

      expect(notificationObj.EID.type).toBe(String);
      expect(notificationObj.EID.required).toBe(true);

      expect(notificationObj.description.type).toBe(String);
      expect(notificationObj.description.required).toBe(true);

      expect(notificationObj.From.type).toBe(String);
      expect(notificationObj.From.required).toBe(true);

      expect(notificationObj.read.type).toBe(Boolean);
      expect(notificationObj.read.default).toBe(false);

      expect(notificationObj.createdAt.type).toBe(Date);
      expect(notificationObj.createdAt.default).toBeDefined();
    });
  });
});
