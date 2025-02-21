import { Schema, model } from "mongoose";
import { type Job, type JobModelType } from "../types/job.types";

export enum JobTypeEnum {
  FullTime = "Full Time",
  PartTime = "Part Time",
  Internship = "Internship",
  Temporary = "Temporary",
  Freelance = "Freelance",
  Contract = "Contract",
  Other = "Other",
}

export const jobSchema = new Schema<Job, JobModelType>({
  JID: { type: String, required: true, index: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: JobTypeEnum,
    required: true,
  },
  salary: { type: Number },
  DID: { type: Schema.Types.String, ref: "Department", required: true },
});

export const JobModel: JobModelType = model<Job, JobModelType>(
  "Job",
  jobSchema
);
