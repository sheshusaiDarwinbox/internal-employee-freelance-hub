import { Schema, model } from "mongoose";
import type { Job, JobModelType, JobType } from "../types/job.types";

export const jobSchema = new Schema<Job, JobModelType>({
  JID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "Full Time",
      "Part Time",
      "Internship",
      "Temporary",
      "Freelance",
      "Contract",
      "Other",
    ] as JobType[],
    required: true,
  },
  salary: { type: Number },
  DID: { type: String, required: true },
});

export const JobModel: JobModelType = model<Job, JobModelType>(
  "Job",
  jobSchema
);
