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
}

export type UserAuthModel = Model<UserAuth>;
