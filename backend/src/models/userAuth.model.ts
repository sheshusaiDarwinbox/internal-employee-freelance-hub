import { Schema, model } from "mongoose";
import { type UserAuth, type UserAuthModel } from "../types/userAuth.types";

export enum UserRole {
  Employee = "Employee",
  Other = "Other",
  Admin = "Admin",
  ProjectManager = "ProjectManager",
}
export const userAuthSchema = new Schema<UserAuth, UserAuthModel>({
  EID: { type: String, index: true, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  role: {
    type: String,
    enum: UserRole,
    required: true,
  },
  JID: { type: Schema.Types.String, ref: "Job", required: true },
  DID: { type: Schema.Types.String, ref: "Department", required: true },
  ManagerID: { type: Schema.Types.String, ref: "UserAuth", required: true },
  phone: { type: String },
  gender: { type: String },
  dob: { type: String },
  doj: { type: Date, required: true },
  maritalStatus: { type: String },
  nationality: { type: String },
  bloodGroup: { type: String },
  workmode: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  emergencyContactNumber: { type: Number },
  freelanceRewardPoints: { type: Number },
  freelanceRating: { type: Number },
  skills: { type: [String] },
  accountBalance: { type: Number },
});

export const User: UserAuthModel = model<UserAuth, UserAuthModel>(
  "UserAuth",
  userAuthSchema
);
