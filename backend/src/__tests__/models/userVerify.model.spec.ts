import mongoose from "mongoose";
import { userVerificationSchema } from "../../models/userVerification.model";

describe("User Verification Model", () => {
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

  describe("userVerificationSchema", () => {
    it("should define the user verification schema with expected properties", () => {
      const verificationObj = (userVerificationSchema as any).obj;

      expect(verificationObj.verifyString.type).toBe(String);
      expect(verificationObj.verifyString.required).toBe(true);

      expect(verificationObj.email.type).toBe(String);
      expect(verificationObj.email.required).toBe(true);

      expect(verificationObj.createdAt.type).toBe(Date);
      expect(verificationObj.createdAt.required).toBe(true);
      expect(verificationObj.createdAt.default).toBeDefined();
      expect(verificationObj.createdAt.expires).toBe("6h");
    });
  });
});
