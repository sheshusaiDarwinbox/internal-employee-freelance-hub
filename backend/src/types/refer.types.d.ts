import type { Model } from "mongoose";

export interface Refer {
  RefID: string;
  GigID: string;
  name: string;
  email: string;
  EID: string;
  description: string;
  skillset: string[]; // Added skillset field as an array of strings
}

export type ReferModelType = Model<Bid>;
