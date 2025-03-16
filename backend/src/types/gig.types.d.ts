import type { Model } from "mongoose";
import { ApprovalStatus } from "../models/task.model";

export interface ProgressTracking {
  subject: string;
  description: string;
  work_percentage: number;
  files: string[];
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
  skills: object[];
  createdAt: Date;
  assignedAt?: Date;
  rewardPoints?: number;
  rating?: number;
  amount?: number;
  feedback?: string;
  img?: string;
  completedAt?: Date;
}

export type GigModel = Model<GigSchema>;
