import type { Model } from "mongoose";

export interface Refer {
  RefID: string;
  GigID: string;
  name: string;
  email: string;
  EID: string;
}

export type ReferModelType = Model<Bid>;
