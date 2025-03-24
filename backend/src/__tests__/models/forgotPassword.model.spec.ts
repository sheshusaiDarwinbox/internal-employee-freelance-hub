import mongoose from "mongoose";
import { forgotPasswordSchema } from "../../models/forgotPassword.model";

describe("Forgot Password Model", () => {
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

  describe("forgotPasswordSchema", () => {
    it("should define the forgot password schema with expected properties", () => {
      const forgotPasswordObj = (forgotPasswordSchema as any).obj;

      expect(forgotPasswordObj.forgotVerifyString.type).toBe(String);
      expect(forgotPasswordObj.forgotVerifyString.required).toBe(true);

      expect(forgotPasswordObj.email.type).toBe(String);
      expect(forgotPasswordObj.email.required).toBe(true);

      expect(forgotPasswordObj.createdAt.type).toBe(Date);
      expect(forgotPasswordObj.createdAt.required).toBe(true);
      expect(forgotPasswordObj.createdAt.default).toBeDefined();
      expect(forgotPasswordObj.createdAt.expires).toBe("1h");
    });
  });
});
