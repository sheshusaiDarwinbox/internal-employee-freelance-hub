import { UserRole } from "../models/userAuth.model";

declare global {
  namespace Express {
    interface User {
      EID: string;
      password?: string;
      role: keyof typeof UserRole;
      email?: string;
      fullName?: string;
      PID: string;
      DID: string;
      ManagerID: string;
      gender?: string;
      dob?: string;
      doj?: string;
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
      img?: string;
      gigsCompleted?: number;
    }
  }
}
