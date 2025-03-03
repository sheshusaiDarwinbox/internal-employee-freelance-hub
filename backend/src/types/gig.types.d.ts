import type { Model } from "mongoose";
import { ApprovalStatus } from "../models/task.model";

export interface ProgressTracking {
  subject: string;
  description: string;
  work_percentage: number;
}

export type OngoingStatusType =
  | "Assigned"
  | "Ongoing"
  | "Completed"
  | "Reviewed";

export interface GigSchema {
  GigID: string;
  DID: string;
  ManagerID: string;
  title: string;
  description: string;
  EID?: string;
  deadline: Date;
  approvalStatus: ApprovalStatus;
  progressTracking?: ProgressTracking[];
  ongoingStatus: OngoingStatusType;
  skillsRequired: string[];
  createdAt: Date;
  assignedAt?: Date;
  rewardPoints?: number;
  rating?: number;
  amount?: number;
  feedback?: string;
}

export type GigModel = Model<GigSchema>;
