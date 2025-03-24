import mongoose from "mongoose";
import { positionSchema, PositionTypeEnum } from "../../models/position.model";

jest.mock("mongoose-paginate-v2", () => jest.fn());

describe("Position Model", () => {
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

  describe("PositionTypeEnum", () => {
    it("should define all expected position types", () => {
      expect(PositionTypeEnum).toEqual({
        FullTime: "FullTime",
        PartTime: "PartTime",
        Internship: "Internship",
        Temporary: "Temporary",
        Freelance: "Freelance",
        Contract: "Contract",
        Other: "Other",
      });
    });
  });

  describe("positionSchema", () => {
    it("should define the position schema with expected properties", () => {
      const positionObj = (positionSchema as any).obj;

      expect(positionObj.PID.type).toBe(String);
      expect(positionObj.PID.required).toBe(true);
      expect(positionObj.PID.index).toBe(true);
      expect(positionObj.PID.unique).toBe(true);

      expect(positionObj.title.type).toBe(String);
      expect(positionObj.title.required).toBe(true);

      expect(positionObj.description.type).toBe(String);
      expect(positionObj.description.required).toBe(true);

      expect(positionObj.type.type).toBe(String);
      expect(positionObj.type.enum).toBe(PositionTypeEnum);
      expect(positionObj.type.required).toBe(true);

      expect(positionObj.salary.type).toBe(Number);

      expect(positionObj.DID.type).toBe(mongoose.Schema.Types.String);
      expect(positionObj.DID.ref).toBe("Department");
      expect(positionObj.DID.required).toBe(true);
    });
  });
});
