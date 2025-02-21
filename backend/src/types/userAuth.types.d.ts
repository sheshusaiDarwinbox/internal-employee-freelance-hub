import { Model } from "mongoose";

import { UserRole } from "../models/userAuth.model";

export interface UserAuth {
  EID: string;
  password: string;
  role: keyof typeof UserRole;
  email?: string;
  JID: string;
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
}

export type UserAuthModel = Model<UserAuth>;
