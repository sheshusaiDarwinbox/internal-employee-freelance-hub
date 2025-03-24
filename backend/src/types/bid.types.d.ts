import type { Model } from "mongoose";

export interface Bid {
  BidID: string;
  GigID: string;
  description: string;
  EID: string;
}

export type BidModelType = Model<Bid>;
