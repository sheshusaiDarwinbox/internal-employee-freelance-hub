import { Model } from "mongoose";

export type JobType =
  | "Full Time"
  | "Part Time"
  | "Internship"
  | "Temporary"
  | "Freelance"
  | "Contract"
  | "Other";

export interface Job {
  JID: string;
  title: string;
  description: string;
  type: JobType;
  salary: number;
  DID: string;
}

export type JobModelType = Model<Job>;
