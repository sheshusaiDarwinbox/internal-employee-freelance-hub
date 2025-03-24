import mongoose from "mongoose";
import {
  UserRole,
  skillSchema,
  userAuthSchema,
  User,
} from "../../models/userAuth.model";

jest.mock("mongoose-paginate-v2", () => jest.fn());
jest.mock("../../utils/insertSkills.util", () => ({
  extendedTechSkills: ["JavaScript", "TypeScript", "React", "Node.js"],
}));

describe("UserAuth Model", () => {
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

  describe("UserRole enum", () => {
    it("should define all expected user roles", () => {
      expect(UserRole).toEqual({
        Employee: "Employee",
        Other: "Other",
        Admin: "Admin",
        Manager: "Manager",
      });
    });
  });

  describe("skillSchema", () => {
    it("should define the skill schema with expected properties", () => {
      const skillObj = (skillSchema as any).obj;

      expect(skillObj.skill.type).toBe(String);
      expect(skillObj.skill.required).toBe(true);
      expect(skillObj.skill.enum).toEqual([
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
      ]);

      expect(skillObj.score.type).toBe(Number);
      expect(skillObj.score.min).toBe(0);
      expect(skillObj.score.max).toBe(1);
      expect(skillObj.score.required).toBe(false);

      expect((skillSchema as any).options._id).toBe(false);
    });
  });

  describe("userAuthSchema", () => {
    it("should define the user auth schema with all required fields and validations", () => {
      const userObj = (userAuthSchema as any).obj;

      expect(userObj.EID.required).toBe(true);
      expect(userObj.password.required).toBe(true);
      expect(userObj.email.required).toBe(true);
      expect(userObj.role.required).toBe(true);
      expect(userObj.verified.required).toBe(true);
      expect(userObj.PID.required).toBe(true);
      expect(userObj.DID.required).toBe(true);
      expect(userObj.ManagerID.required).toBe(true);
      expect(userObj.doj.required).toBe(true);

      expect(userObj.EID.type).toBe(String);
      expect(userObj.email.type).toBe(String);
      expect(userObj.password.type).toBe(String);
      expect(userObj.role.type).toBe(String);
      expect(userObj.verified.type).toBe(Boolean);
      expect(userObj.doj.type).toBe(Date);

      [
        "fullName",
        "phone",
        "gender",
        "dob",
        "maritalStatus",
        "nationality",
        "bloodGroup",
        "workmode",
        "address",
        "city",
        "state",
        "country",
        "pincode",
        "img",
      ].forEach((field) => {
        expect(userObj[field].type).toBe(String);
      });

      [
        "emergencyContactNumber",
        "freelanceRewardPoints",
        "freelanceRating",
        "accountBalance",
        "gigsCompleted",
      ].forEach((field) => {
        expect(userObj[field].type).toBe(Number);
      });

      expect(userObj.EID.unique).toBe(true);
      expect(userObj.email.unique).toBe(true);

      expect(userObj.EID.index).toBe(true);

      expect(userObj.role.enum).toBe(UserRole);

      expect(userObj.PID.ref).toBe("Position");
      expect(userObj.DID.ref).toBe("Department");
      expect(userObj.ManagerID.ref).toBe("UserAuth");

      expect(userObj.gigsCompleted.default).toBe(0);

      expect(userObj.skills.type[0]).toBe(skillSchema);
    });
  });
});
