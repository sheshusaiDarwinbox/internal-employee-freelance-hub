import { Schema, model } from "mongoose";
import type {
  UserAuth,
  UserAuthModel,
  UserRole,
} from "../types/userAuth.types";

const userAuthSchema = new Schema<UserAuth, UserAuthModel>({
  EID: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  role: {
    type: String,
    enum: ["Employee", "Admin", "ProjectManager", "Other"] as UserRole[],
    required: true,
  },
  JID: { type: String, required: true },
  DID: { type: String, required: true },
  ManagerID: { type: String, required: true },
  phone: { type: String },
  gender: { type: String },
  DOB: { type: String },
  DOJ: { type: String, required: true },
  maritalStatus: { type: String },
  nationality: { type: String },
  bloodGroup: { type: String },
  workmode: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  emergencyContactName: { type: String },
  freelanceRewardPoints: { type: Number },
  freelanceRating: { type: Number },
  skills: { type: [String] },
  AccountBalance: { type: Number },
});

export const User: UserAuthModel = model<UserAuth, UserAuthModel>(
  "UserAuth",
  userAuthSchema
);
