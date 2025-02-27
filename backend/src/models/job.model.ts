import { Schema, model, type PaginateModel } from "mongoose";
import { type Job, type JobModelType } from "../types/job.types";
import paginate from "mongoose-paginate-v2";

export enum JobTypeEnum {
  FullTime = "FullTime",
  PartTime = "PartTime",
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

jobSchema.index({ title: "text" });
jobSchema.plugin(paginate);

export const JobModel = model<Job, PaginateModel<JobModelType>>(
  "Job",
  jobSchema
);
