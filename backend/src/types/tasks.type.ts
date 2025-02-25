// Define the ApprovalStatus enum
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Define the ProgressStatus interface
export interface ProgressStatus {
  subject: string;
  description: string;
  work_percentage: number;
}

// Define the Task interface
export interface Task {
  TaskID: string;
  DID: string;
  managerID: string;
  title: string;
  description: string;
  EID?: string;
  deadline: Date;
  approvalStatus: ApprovalStatus;
  progressStatus?: ProgressStatus[];
  skillsRequired: string[];
  createdAt: Date;
  assignedAt?: Date;
  rewardPoints?: number;
  rating?: number;
  amount?: number;
  feedback?: string;
}
