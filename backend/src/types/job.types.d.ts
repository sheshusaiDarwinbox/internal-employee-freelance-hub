import { Model } from "mongoose";

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
