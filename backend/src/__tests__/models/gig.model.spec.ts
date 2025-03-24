import mongoose from "mongoose";
import {
  gigSchema,
  gigSkillSchema,
  ApprovalStatus,
  OngoingStatus,
} from "../../models/gig.model";
import { extendedTechSkills } from "../../utils/insertSkills.util";

jest.mock("mongoose-paginate-v2", () => jest.fn());

describe("Gig Model", () => {
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

  describe("gigSkillSchema", () => {
    it("should define the skill schema with expected properties", () => {
      const skillObj = (gigSkillSchema as any).obj;

      expect(skillObj.skill.type).toBe(String);
      expect(skillObj.skill.required).toBe(true);
      expect(skillObj.skill.enum).toEqual(extendedTechSkills);

      expect(skillObj.weight.type).toBe(Number);
      expect(skillObj.weight.min).toBe(0);
      expect(skillObj.weight.max).toBe(1);
      expect(skillObj.weight.required).toBe(false);
    });
  });

  describe("gigSchema", () => {
    it("should define the gig schema with expected properties", () => {
      const gigObj = (gigSchema as any).obj;

      expect(gigObj.GigID.type).toBe(String);
      expect(gigObj.GigID.required).toBe(true);

      expect(gigObj.DID.type).toBe(String);
      expect(gigObj.DID.required).toBe(true);

      expect(gigObj.ManagerID.type).toBe(String);
      expect(gigObj.ManagerID.required).toBe(true);

      expect(gigObj.title.type).toBe(String);
      expect(gigObj.title.required).toBe(true);

      expect(gigObj.description.type).toBe(String);
      expect(gigObj.description.required).toBe(true);

      expect(gigObj.EID.type).toBe(String);

      expect(gigObj.deadline.type).toBe(Date);
      expect(gigObj.deadline.required).toBe(true);

      expect(gigObj.approvalStatus.type).toBe(String);
      expect(gigObj.approvalStatus.enum).toEqual(Object.values(ApprovalStatus));
      expect(gigObj.approvalStatus.default).toBe(ApprovalStatus.PENDING);

      expect(gigObj.ongoingStatus.type).toBe(String);
      expect(gigObj.ongoingStatus.enum).toEqual(Object.values(OngoingStatus));

      expect(gigObj.skills.type[0]).toBe(gigSkillSchema);
      expect(gigObj.skills.required).toBe(true);

      expect(gigObj.createdAt.type).toBe(Date);
      expect(gigObj.createdAt.default).toBeDefined();
      expect(gigObj.createdAt.required).toBe(true);

      expect(gigObj.rewardPoints.type).toBe(Number);
      expect(gigObj.rewardPoints.required).toBe(true);
      expect(gigObj.rewardPoints.default).toBe(0);

      expect(gigObj.amount.type).toBe(Number);
      expect(gigObj.amount.required).toBe(true);
      expect(gigObj.amount.default).toBe(0);
    });
  });
});
