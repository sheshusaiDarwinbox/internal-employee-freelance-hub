import mongoose from "mongoose";
import { bidSchema } from "../../models/bid.model";

jest.mock("mongoose-paginate-v2", () => jest.fn());

describe("Bid Model", () => {
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

  describe("bidSchema", () => {
    it("should define the bid schema with expected properties", () => {
      const bidObj = (bidSchema as any).obj;

      expect(bidObj.BidID.type).toBe(String);
      expect(bidObj.BidID.required).toBe(true);
      expect(bidObj.BidID.index).toBe(true);
      expect(bidObj.BidID.unique).toBe(true);

      expect(bidObj.GigID.type).toBe(String);
      expect(bidObj.GigID.required).toBe(true);

      expect(bidObj.description.type).toBe(String);
      expect(bidObj.description.required).toBe(true);

      expect(bidObj.EID.type).toBe(String);
      expect(bidObj.EID.required).toBe(true);
    });
  });
});
