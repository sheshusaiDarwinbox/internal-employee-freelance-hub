import type { Model } from "mongoose";

export enum UserRole {
  Employee = "Employee",
  Other = "Other",
  Admin = "Admin",
  ProjectManager = "ProjectManager",
}

export interface UserAuth {
  EID: string;
  password: string;
  role: UserRole;
  email: string;
  JID: string;
  DID: string;
  ManagerID: string;
  gender: string;
  DOB: string;
  DOJ: string;
  nationality: string;
  maritalStatus: string;
  bloodGroup: string;
  phone: string;
  workmode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  emergencyContactName: string;
  freelanceRewardPoints: number;
  freelanceRating: number;
  skills: string[];
}

export type UserAuthModel = Model<UserAuth>;
