import { Model } from "mongoose";

import { UserRole } from "../models/userAuth.model";

export interface UserAuth {
  EID: string;
  password: string;
  role: keyof typeof UserRole;
  email: string;
  verified: boolean;
  PID: string;
  DID: string;
  ManagerID: string;
  gender?: string;
  dob?: string;
  doj?: Date;
  nationality?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  phone?: string;
  workmode?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  emergencyContactNumber?: number;
  freelanceRewardPoints?: number;
  freelanceRating?: number;
  skills?: string[];
  accountBalance?: number;
  img?: string;
  fullName?: string;
  gigsCompleted?: number;
}

export type UserAuthModel = Model<UserAuth>;

export interface UserVerificationType {
  email: string;
  verifyString: string;
  createdAt: Date;
}

export type UserVerificationModel = Model<UserVerification>;

export interface forgotPasswordType {
  email: string;
  forgotVerifyString: string;
  createdAt: Data;
}

export type forgotPasswordModel = Model<forgotPasswordType>;
