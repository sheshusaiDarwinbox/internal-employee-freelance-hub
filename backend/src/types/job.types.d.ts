import { Model } from "mongoose";

export enum JobTypeEnum {
  FullTime = "Full Time",
  PartTime = "Part Time",
  Internship = "Internship",
  Temporary = "Temporary",
  Freelance = "Freelance",
  Contract = "Contract",
  Other = "Other",
}

export type JobType = keyof typeof JobTypeEnum;
export interface Job {
  JID: string;
  title: string;
  description: string;
  type: JobType;
  salary: number;
  DID: string;
}

export type JobModelType = Model<Job>;
