import { PaginateModel, Schema, model } from "mongoose";
import type { GigSchema, GigModel } from "../types/gig.types";
import paginate from "mongoose-paginate-v2";

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum OngoingStatus {
  UnAssigned = "UnAssigned",
  Ongoing = "Ongoing",
  Completed = "Completed",
  Reviewed = "Reviewed",
}

const gigSchema = new Schema<GigSchema, GigModel>({
  GigID: { type: String, required: true },
  DID: { type: String, required: true },
  ManagerID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  EID: { type: String },
  deadline: { type: Date, required: true },
  approvalStatus: {
    type: String,
    enum: Object.values(ApprovalStatus),
    default: ApprovalStatus.PENDING,
  },
  progressTracking: [
    {
      subject: { type: String },
      description: { type: String },
      work_percentage: { type: Number },
    },
  ],
  ongoingStatus: {
    type: String,
    enum: Object.values(OngoingStatus),
  },
  skillsRequired: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now, required: true },
  assignedAt: { type: Date },
  rewardPoints: { type: Number },
  rating: { type: Number },
  amount: { type: Number, required: true },
  feedback: { type: String },
});

gigSchema.index({ title: "text" });

gigSchema.plugin(paginate);

export const Gig = model<GigSchema, PaginateModel<GigModel>>("Gig", gigSchema);
