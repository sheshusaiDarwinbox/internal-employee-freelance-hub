import { UserRole } from "../models/userAuth.model";

declare global {
  namespace Express {
    interface User {
      EID: string;
      password: string;
      role: keyof typeof UserRole;
      email?: string;
      JID: string;
      DID: string;
      ManagerID: string;
      gender?: string;
      DOB?: string;
      DOJ?: string;
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
      AccountBalance?: number;
    }
  }
}
