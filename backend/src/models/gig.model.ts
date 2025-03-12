import { PaginateModel, Schema, model } from "mongoose";
import type { GigSchema, GigModel } from "../types/gig.types";
import paginate from "mongoose-paginate-v2";
import { extendedTechSkills } from "../utils/insertSkills.util";

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

export const gigSkillSchema = new Schema(
  {
    skill: {
      type: String,
      enum: extendedTechSkills,
      required: true,
    },
    weight: {
      type: Number,
      min: 0,
      max: 1,
      required: false,
    },
  },
  { _id: false }
);

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
      files: { type: [String] },
    },
  ],
  ongoingStatus: {
    type: String,
    enum: Object.values(OngoingStatus),
  },
  skills: { type: [gigSkillSchema], required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  assignedAt: { type: Date },
  rewardPoints: { type: Number, required: true, default: 0 },
  rating: { type: Number },
  amount: { type: Number, required: true, default: 0 },
  feedback: { type: String },
  img: { type: String },
});

gigSchema.index({ title: "text" });

gigSchema.plugin(paginate);

export const Gig = model<GigSchema, PaginateModel<GigModel>>("Gig", gigSchema);
export type { GigSchema }; // Export GigSchema
