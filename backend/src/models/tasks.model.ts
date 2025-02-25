import { Schema, model } from "mongoose";
import { Task } from "../types/tasks.type";
import { ApprovalStatus } from "../types/tasks.type";

const taskSchema = new Schema<Task>({
  TaskID: { type: String, required: true },
  DID: { type: String, required: true },
  managerID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  EID: { type: String },
  deadline: { type: Date, required: true },
  approvalStatus: { 
    type: String, 
    enum: Object.values(ApprovalStatus),
    default: ApprovalStatus.PENDING
  },
  progressStatus: [{
    subject: { type: String },
    description: { type: String},
    work_percentage: { type: Number}
  }],
  skillsRequired: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now , required: true},
  assignedAt: { type: Date },
  rewardPoints: { type: Number},
  rating: { type: Number},
  amount: { type: Number},
  feedback: { type: String, required: true }
});

export const TaskModel = model<Task>('Tasks', taskSchema);
